let lastCode = '';

async function generateCode() {
    const userInput = document.getElementById('userInput').value;
    const loading = document.getElementById('loading');
    const previewArea = document.getElementById('previewArea');

    if (!userInput.trim()) {
        showToast('请输入你的需求！');
        return;
    }

    loading.style.display = 'block';
    if (editor) {
        editor.setValue('');
    }
    previewArea.innerHTML = '';

    try {
        await callDeepSeekApiStream(userInput, previewArea);
        lastCode = editor ? editor.getValue() : '';
        saveToHistory(lastCode);
        switchView('preview');
    } catch (error) {
        showToast('生成代码时发生错误：' + error.message);
        switchView('code');
    } finally {
        loading.style.display = 'none';
        updateToolbarState();
    }
}

function switchView(view) {
    document.getElementById('previewArea').style.display = view === 'preview' ? 'block' : 'none';
    document.getElementById('codeWrapper').style.display = view === 'code' ? 'flex' : 'none';
    document.getElementById('previewBtn').classList.toggle('active', view === 'preview');
    document.getElementById('codeBtn').classList.toggle('active', view === 'code');
    updateToolbarState();
}

function showPreview(code) {
    const previewArea = document.getElementById('previewArea');
    if (!previewArea) return;

    // 直接使用原始code，不做HTML实体转义
    const fullHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { 
                    margin: 0; 
                    padding: 16px; 
                    font-family: system-ui, -apple-system, sans-serif;
                    line-height: 1.5;
                }
                * { 
                    box-sizing: border-box;
                }
                img {
                    max-width: 100%;
                    height: auto;
                }
            </style>
        </head>
        <body>
            ${code}
            <script>
                // 处理链接点击
                Array.from(document.querySelectorAll('a')).forEach(a => {
                    a.addEventListener('click', function(e) {
                        e.preventDefault();
                        if(this.href) window.open(this.href, '_blank');
                    });
                });
                // 处理表单提交
                Array.from(document.querySelectorAll('form')).forEach(form => {
                    form.addEventListener('submit', function(e) {
                        e.preventDefault();
                        alert('预览模式下表单提交已禁用');
                    });
                });
                // 处理图片加载错误
                Array.from(document.querySelectorAll('img')).forEach(img => {
                    img.onerror = function() {
                        this.style.display = 'none';
                    };
                });
            </script>
        </body>
        </html>
    `;

    // 只创建一次iframe，后续只更新srcdoc
    let iframe = previewArea.querySelector('iframe.previewFrame');
    if (!iframe) {
        previewArea.innerHTML = '';
        iframe = document.createElement('iframe');
        iframe.className = 'previewFrame';
        iframe.style.cssText = 'width:100%;height:100%;border:none;border-radius:8px;background:#fff;';
        iframe.sandbox = 'allow-scripts allow-same-origin allow-forms allow-popups';
        previewArea.appendChild(iframe);
    }
    iframe.srcdoc = fullHtml;
}

// 添加预览相关的CSS样式
const previewStyles = document.createElement('style');
previewStyles.textContent = `
    .preview-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #666;
        font-size: 1.1rem;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .preview-error {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: #dc2626;
        font-size: 1.1rem;
        text-align: center;
        padding: 1rem;
        background: #fef2f2;
        border-radius: 8px;
    }
    
    #previewArea {
        position: relative;
        overflow: hidden;
        min-height: 350px;
        max-height: 75vh;
    }
`;
document.head.appendChild(previewStyles);

function cleanCodeBlock(raw) {
    return raw
        .replace(/^\s*```html\s*/i, '')
        .replace(/^\s*```\s*/i, '')
        .replace(/^\s+/, '')
        .replace(/```+\s*$/g, '')
        .replace(/\s+$/g, '');
}

// 流式输出实现
async function callDeepSeekApiStream(prompt, previewArea) {
    const userApiKey = localStorage.getItem('userApiKey');
    const userBaseUrl = localStorage.getItem('userBaseUrl');
    const userModelName = localStorage.getItem('userModelName');
    const apiKey = userApiKey || 'sk-acttqosqchyktyrnsvkiioqfwbxnherzspkjkrykqtgjjnli';
    const baseUrl = userBaseUrl || 'https://api.siliconflow.cn/v1/chat/completions';
    const model = userModelName || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            model: model,
            messages: [
                { role: 'system', content: '你是一个专业的前端开发助手，请根据用户需求生成完整的HTML网页代码。注意，你只需要给出完整的网页代码，不需要给出文字说明,只需要给出代码和代码中适当的注释。代码以外的任何文字都不要输出。不要使用外界的js或css库，css和js完全手写' },
                { role: 'user', content: prompt }
            ],
            stream: true
        })
    });
    if (!response.body) throw new Error('API未返回流式数据');
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let code = '';
    let done = false;
    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
            const chunk = decoder.decode(value, { stream: true });
            chunk.split('\n').forEach(line => {
                if (line.startsWith('data:')) {
                    const dataStr = line.replace('data:', '').trim();
                    if (dataStr === '[DONE]' || !dataStr) return;
                    try {
                        const data = JSON.parse(dataStr);
                        let delta = data.choices?.[0]?.delta?.content || '';
                        code += delta;
                        // 实时更新代码和预览
                        let displayCode = cleanCodeBlock(code);
                        if (editor) {
                            editor.setValue(displayCode);
                        }
                        showPreview(displayCode);
                    } catch (e) {
                        // 忽略解析失败
                    }
                }
            });
        }
    }
}

// 复制代码功能
function copyCode() {
    if (editor) {
        const code = editor.getValue();
        navigator.clipboard.writeText(code).then(() => {
            showToast('代码已复制到剪贴板');
        });
    }
}

// 格式化代码功能
function formatCode() {
    if (editor) {
        const code = editor.getValue();
        try {
            const formattedCode = prettier.format(code, {
                parser: "html",
                plugins: prettierPlugins
            });
            editor.setValue(formattedCode);
            showToast('代码已格式化');
        } catch (error) {
            showToast('格式化失败：' + error.message);
        }
    }
}

// 下载代码功能
function downloadCode() {
    if (editor) {
        const code = editor.getValue();
        const blob = new Blob([code], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'generated-code.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('代码已下载');
    }
}

// 历史记录功能
let history = JSON.parse(localStorage.getItem('codeHistory') || '[]');

function saveToHistory(code) {
    const timestamp = new Date().toLocaleString();
    history.unshift({ code, timestamp });
    if (history.length > 10) history.pop();
    localStorage.setItem('codeHistory', JSON.stringify(history));
    updateHistoryList();
}

function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = history.map((item, index) => `
                <div class="history-item" onclick="loadFromHistory(${index})">
                    <div>${item.timestamp}</div>
                    <div style="color: #666; font-size: 0.9rem;">${item.code.substring(0, 50)}...</div>
                </div>
            `).join('');
}

function loadFromHistory(index) {
    const code = history[index].code;
    if (editor) {
        editor.setValue(code);
    }
    showPreview(code);
    switchView('preview');
    toggleHistory();
    updateToolbarState();
}

function toggleHistory() {
    const panel = document.getElementById('historyPanel');
    panel.classList.toggle('active');
}

// 主题切换功能
function toggleTheme() {
    const body = document.body;
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    body.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    showToast(`已切换到${newTheme === 'dark' ? '深色' : '浅色'}主题`);
}

// 初始化主题
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.setAttribute('data-theme', savedTheme);

// Toast 提示功能
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('active');
    setTimeout(() => {
        toast.classList.remove('active');
    }, 2500);
}

// 设置弹窗相关
function openSettings() {
    document.getElementById('settingsModal').classList.add('active');
    document.getElementById('apiKeyInput').value = localStorage.getItem('userApiKey') || '';
    document.getElementById('baseUrlInput').value = localStorage.getItem('userBaseUrl') || '';
    document.getElementById('modelInput').value = localStorage.getItem('userModelName') || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
}
function closeSettings() {
    document.getElementById('settingsModal').classList.remove('active');
}
function updateStatusModel() {
    const model = localStorage.getItem('userModelName') || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
    const el = document.getElementById('statusModel');
    if (el) el.textContent = model;
}
function saveSettings() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const baseUrl = document.getElementById('baseUrlInput').value.trim();
    const modelName = document.getElementById('modelInput').value.trim();
    if (apiKey) localStorage.setItem('userApiKey', apiKey);
    if (baseUrl) localStorage.setItem('userBaseUrl', baseUrl);
    if (modelName) localStorage.setItem('userModelName', modelName);
    showToast('设置已保存');
    closeSettings();
    updateStatusModel();
}

function useDefaultConfig() {
    document.getElementById('apiKeyInput').value = 'sk-acttqosqchyktyrnsvkiioqfwbxnherzspkjkrykqtgjjnli';
    document.getElementById('baseUrlInput').value = 'https://api.siliconflow.cn/v1/chat/completions';
    document.getElementById('modelInput').value = 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
    showToast('已填充默认配置');
}

// 快捷键支持
window.addEventListener('keydown', function(e) {
    // Ctrl+Enter 生成代码
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (document.activeElement.id === 'userInput' || document.activeElement.tagName === 'BODY') {
            generateCode();
            e.preventDefault();
        }
    }
    // Esc 关闭设置弹窗和历史记录
    if (e.key === 'Escape') {
        const settingsModal = document.getElementById('settingsModal');
        if (settingsModal && settingsModal.classList.contains('active')) {
            closeSettings();
            e.preventDefault();
            return;
        }
        const historyPanel = document.getElementById('historyPanel');
        if (historyPanel && historyPanel.classList.contains('active')) {
            toggleHistory();
            e.preventDefault();
        }
    }
});

// 点击历史记录面板外部关闭面板
window.addEventListener('mousedown', function(e) {
    const panel = document.getElementById('historyPanel');
    if (panel && panel.classList.contains('active')) {
        if (!panel.contains(e.target) && !e.target.closest('.sidebar-btn[onclick*="toggleHistory"]')) {
            toggleHistory();
        }
    }
});

// 页面加载时和设置保存后都调用
updateStatusModel();

function onModelChange(e) {
    const model = e.target.value;
    localStorage.setItem('userModelName', model);
    updateStatusModel();
    showToast('已切换模型：' + model);
}

// 页面加载时同步下拉框选中项
window.addEventListener('DOMContentLoaded', function() {
    const model = localStorage.getItem('userModelName') || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
    const select = document.getElementById('modelSelect');
    if (select) {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === model) {
                select.selectedIndex = i;
                break;
            }
        }
    }
    updateToolbarState();
});

function setToolbarDisabled(disabled) {
    const btns = document.querySelectorAll('.toolbar button');
    btns.forEach(btn => btn.disabled = disabled);
    if (disabled) {
        btns.forEach(btn => btn.classList.add('disabled'));
    } else {
        btns.forEach(btn => btn.classList.remove('disabled'));
    }
}

function updateToolbarState() {
    const code = editor ? editor.getValue().trim() : '';
    setToolbarDisabled(!code);
}

// 模型列表及评分功能
const MODELS = [
    "Qwen/Qwen3-8B",
    "THUDM/GLM-Z1-9B-0414",
    "THUDM/GLM-4-9B-0414",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B",
    "Qwen/Qwen2.5-7B-Instruct",
    "Qwen/Qwen2.5-Coder-7B-Instruct",
    "internlm/internlm2_5-7b-chat",
    "Qwen/Qwen2-7B-Instruct",
    "THUDM/glm-4-9b-chat",
    "THUDM/chatglm3-6b"
];

function getModelRatings() {
    return JSON.parse(localStorage.getItem('modelRatings') || '{}');
}
function setModelRating(model, rating) {
    const ratings = getModelRatings();
    ratings[model] = rating;
    localStorage.setItem('modelRatings', JSON.stringify(ratings));
}
function renderModelList() {
    const modelList = document.getElementById('modelList');
    if (!modelList) return;
    const ratings = getModelRatings();
    const selectedModel = localStorage.getItem('userModelName') || MODELS[0];
    modelList.innerHTML = MODELS.map(model => {
        const rating = ratings[model] || 0;
        return `<div class="model-item${selectedModel === model ? ' selected' : ''}" data-model="${model}" onclick="selectModel(event, '${model}')">
            <span>${model}</span>
            <span class="model-rating" onclick="event.stopPropagation();">
                ${[1,2,3,4,5].map(i => `<i class='star fa${i <= rating ? 's' : 'r'} fa-star' onclick='rateModel(event, "${model}", ${i})'></i>`).join('')}
            </span>
        </div>`;
    }).join('');
}
window.renderModelList = renderModelList;
function selectModel(e, model) {
    localStorage.setItem('userModelName', model);
    renderModelList();
    updateStatusModel();
    showToast('已切换模型：' + model);
}
window.selectModel = selectModel;
function rateModel(e, model, rating) {
    setModelRating(model, rating);
    renderModelList();
    showToast(`已为 ${model} 打分：${rating} 星`);
}
window.rateModel = rateModel;
// 页面加载时渲染模型列表
window.addEventListener('DOMContentLoaded', function() {
    renderModelList();
    // ... existing code ...
});

function toggleModelPanel() {
    const panel = document.getElementById('modelPanel');
    panel.classList.toggle('active');
}
window.toggleModelPanel = toggleModelPanel;

// 点击模型列表面板外部关闭面板
window.addEventListener('mousedown', function(e) {
    const panel = document.getElementById('modelPanel');
    if (panel && panel.classList.contains('active')) {
        if (!panel.contains(e.target) && !e.target.closest('.sidebar-btn[onclick*="toggleModelPanel"]')) {
            toggleModelPanel();
        }
    }
});

// 生成需求弹窗相关
function openPromptDialog() {
    var modal = document.getElementById('promptResultWindow');
    if (modal) {
        modal.style.display = 'flex';
    }
    var input = document.getElementById('promptInput');
    if (input) input.value = '';
    var resultDiv = document.getElementById('promptResultText');
    if (resultDiv) resultDiv.textContent = '';
}
function closePromptResultWindow() {
    var modal = document.getElementById('promptResultWindow');
    if (modal) {
        modal.style.display = 'none';
    }
}
async function generatePrompt() {
    // 优先读取弹窗下方输入框内容
    let input = '';
    const resultInput = document.getElementById('promptResultInput');
    if (resultInput && resultInput.value.trim()) {
        input = resultInput.value.trim();
    } else {
        const promptInput = document.getElementById('promptInput');
        if (promptInput && promptInput.value.trim()) {
            input = promptInput.value.trim();
        }
    }
    const btn = document.getElementById('generatePromptBtnDialog') || document.getElementById('generatePromptBtnResult');
    if (btn) {
        btn.disabled = true;
        btn.textContent = 'AI正在生成，请稍候...';
    }
    const resultDiv = document.getElementById('promptResultText');
    resultDiv.textContent = '';
    try {
        const userApiKey = localStorage.getItem('userApiKey');
        const userBaseUrl = localStorage.getItem('userBaseUrl');
        const userModelName = localStorage.getItem('userModelName');
        const apiKey = userApiKey || 'sk-acttqosqchyktyrnsvkiioqfwbxnherzspkjkrykqtgjjnli';
        const baseUrl = userBaseUrl || 'https://api.siliconflow.cn/v1/chat/completions';
        const model = userModelName || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
        const messages = [
            { role: 'system', content: '你是一个专业的产品经理助理，请根据用户的简要描述，帮他完善成详细的产品需求文档，要求结构清晰、条理分明，适合直接用于AI代码生成。' },
        ];
        if (input) {
            messages.push({ role: 'user', content: input });
        } else {
            messages.push({ role: 'user', content: '请帮我生成一个常见的前端页面需求文档和AI prompt。' });
        }
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: true
            })
        });
        if (!response.body) throw new Error('API未返回流式数据');
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let doc = '';
        let done = false;
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
                const chunk = decoder.decode(value, { stream: true });
                chunk.split('\n').forEach(line => {
                    if (line.startsWith('data:')) {
                        const dataStr = line.replace('data:', '').trim();
                        if (dataStr === '[DONE]' || !dataStr) return;
                        try {
                            const data = JSON.parse(dataStr);
                            let delta = data.choices?.[0]?.delta?.content || '';
                            doc += delta;
                            resultDiv.textContent = doc;
                            resultDiv.scrollTop = resultDiv.scrollHeight;
                        } catch (e) {
                            // 忽略解析失败
                        }
                    }
                });
            }
        }
    } catch (e) {
        resultDiv.textContent = 'AI生成失败，请检查网络或API设置';
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = '生成需求文档';
        }
    }
}

function usePromptResultText() {
    var resultDiv = document.getElementById('promptResultText');
    var userInput = document.getElementById('userInput');
    if (resultDiv && userInput) {
        userInput.value = resultDiv.textContent || '';
    }
    closePromptResultWindow();
}

async function polishUserInput() {
    const userInput = document.getElementById('userInput');
    const text = userInput.value.trim();
    // 新增：右侧浮窗相关元素
    const floatWindow = document.getElementById('polishFloatWindow');
    const floatResult = document.getElementById('polishFloatResult');
    const applyFloatBtn = document.getElementById('applyPolishFloatBtn');
    const closeFloatBtn = document.getElementById('closePolishFloatBtn');
    // 隐藏原有下方结果区
    const polishResultWrapper = document.getElementById('polishResultWrapper');
    if (polishResultWrapper) polishResultWrapper.style.display = 'none';
    if (!text) {
        showToast('请输入你的需求！');
        return;
    }
    // 显示右侧浮窗
    floatWindow.style.display = 'flex';
    floatResult.textContent = '';
    applyFloatBtn.style.display = 'none';
    // 关闭按钮绑定
    closeFloatBtn.onclick = function() { floatWindow.style.display = 'none'; };
    // 应用按钮绑定
    applyFloatBtn.onclick = function() {
        userInput.value = floatResult.textContent || '';
        floatWindow.style.display = 'none';
    };
    const btn = document.getElementById('polishBtn');
    btn.disabled = true;
    btn.textContent = 'AI正在润色...';
    try {
        const userApiKey = localStorage.getItem('userApiKey');
        const userBaseUrl = localStorage.getItem('userBaseUrl');
        const userModelName = localStorage.getItem('userModelName');
        const apiKey = userApiKey || 'sk-acttqosqchyktyrnsvkiioqfwbxnherzspkjkrykqtgjjnli';
        const baseUrl = userBaseUrl || 'https://api.siliconflow.cn/v1/chat/completions';
        const model = userModelName || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B';
        const response = await fetch(baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: '你是一个专业的产品经理助理，请对用户输入的需求进行专业、简洁、准确的润色，使其更适合用于AI代码生成。只输出润色后的内容，不要输出其它说明。' },
                    { role: 'user', content: text }
                ],
                stream: true
            })
        });
        if (!response.body) throw new Error('API未返回流式数据');
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let result = '';
        let done = false;
        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            if (value) {
                const chunk = decoder.decode(value, { stream: true });
                chunk.split('\n').forEach(line => {
                    if (line.startsWith('data:')) {
                        const dataStr = line.replace('data:', '').trim();
                        if (dataStr === '[DONE]' || !dataStr) return;
                        try {
                            const data = JSON.parse(dataStr);
                            let delta = data.choices?.[0]?.delta?.content || '';
                            result += delta;
                            floatResult.textContent = result;
                        } catch (e) {
                            // 忽略解析失败
                        }
                    }
                });
            }
        }
        if (result.trim()) {
            applyFloatBtn.style.display = 'block';
        }
    } catch (e) {
        showToast('润色失败，请检查网络或API设置');
        floatResult.textContent = '';
        floatWindow.style.display = 'none';
    } finally {
        btn.disabled = false;
        btn.textContent = '润色需求';
    }
}