// Monaco Editor 实例
let editor = null;
let currentFile = null;
let fileHistory = new Map(); // 存储文件历史版本

// 初始化 Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    editor = monaco.editor.create(document.getElementById('monacoEditor'), {
        value: '',
        language: 'html',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: {
            enabled: true
        },
        fontSize: 14,
        tabSize: 2,
        wordWrap: 'on'
    });

    // 监听内容变化，自动保存历史版本
    editor.onDidChangeModelContent(() => {
        if (currentFile) {
            saveToHistory(currentFile, editor.getValue());
        }
    });
});

// 保存代码片段
function saveCodeSnippet() {
    const code = editor.getValue();
    const snippetName = prompt('请输入代码片段名称：');
    if (snippetName) {
        const snippets = JSON.parse(localStorage.getItem('codeSnippets') || '{}');
        snippets[snippetName] = {
            code,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('codeSnippets', JSON.stringify(snippets));
        showToast('代码片段已保存');
    }
}

// 保存到历史版本
function saveToHistory(fileName, content) {
    if (!fileHistory.has(fileName)) {
        fileHistory.set(fileName, []);
    }
    const history = fileHistory.get(fileName);
    history.push({
        content,
        timestamp: new Date().toISOString()
    });
    // 只保留最近的10个版本
    if (history.length > 10) {
        history.shift();
    }
}

// 版本对比
function compareVersions() {
    if (!currentFile || !fileHistory.has(currentFile)) {
        showToast('没有可比较的历史版本');
        return;
    }

    const history = fileHistory.get(currentFile);
    if (history.length < 2) {
        showToast('需要至少两个版本才能进行比较');
        return;
    }

    // 创建对比对话框
    const dialog = document.createElement('div');
    dialog.className = 'version-compare-dialog';
    dialog.innerHTML = `
        <div class="version-compare-content">
            <h3>版本对比</h3>
            <div class="version-list">
                ${history.map((version, index) => `
                    <div class="version-item">
                        <input type="radio" name="version" value="${index}" ${index === history.length - 1 ? 'checked' : ''}>
                        <span>版本 ${index + 1} (${new Date(version.timestamp).toLocaleString()})</span>
                    </div>
                `).join('')}
            </div>
            <div class="compare-buttons">
                <button onclick="compareSelectedVersions()">比较选中版本</button>
                <button onclick="closeCompareDialog()">关闭</button>
            </div>
        </div>
    `;
    document.body.appendChild(dialog);
}

// 显示提示信息
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// 切换文件
function switchFile(fileName, content) {
    currentFile = fileName;
    const model = monaco.editor.createModel(content, getLanguageFromFileName(fileName));
    editor.setModel(model);
}

// 根据文件名获取语言
function getLanguageFromFileName(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const languageMap = {
        'html': 'html',
        'css': 'css',
        'js': 'javascript',
        'json': 'json',
        'md': 'markdown',
        'py': 'python',
        'java': 'java',
        'cpp': 'cpp',
        'c': 'c',
        'cs': 'csharp',
        'php': 'php',
        'ts': 'typescript'
    };
    return languageMap[ext] || 'plaintext';
}

// 导出所有函数到全局作用域
window.saveCodeSnippet = saveCodeSnippet;
window.compareVersions = compareVersions;
window.switchFile = switchFile; 