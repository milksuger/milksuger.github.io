// 模板数据
const templates = [
    {
        id: 1,
        category: 'code',
        title: '函数生成模板',
        description: '生成一个完整的函数，包含参数类型、返回值和错误处理',
        preview: `请帮我生成一个函数，要求：
1. 函数名：calculateTotal
2. 参数：items数组，每个元素包含price和quantity
3. 返回值：总金额（保留两位小数）
4. 包含参数验证和错误处理`,
        content: `请帮我生成一个函数，要求：
1. 函数名：calculateTotal
2. 参数：items数组，每个元素包含price和quantity
3. 返回值：总金额（保留两位小数）
4. 包含参数验证和错误处理

请使用TypeScript编写，并添加适当的注释。`,
        usage: 1250,
        rating: 4.8
    },
    {
        id: 2,
        category: 'debug',
        title: '错误诊断模板',
        description: '帮助定位和解决代码中的错误',
        preview: `请帮我诊断以下代码中的错误：
[代码片段]

错误信息：
[错误详情]

预期行为：
[期望结果]`,
        content: `请帮我诊断以下代码中的错误：
[代码片段]

错误信息：
[错误详情]

预期行为：
[期望结果]

已尝试的解决方案：
[已尝试的方法]

请提供：
1. 错误原因分析
2. 解决方案
3. 预防措施`,
        usage: 980,
        rating: 4.6
    },
    {
        id: 3,
        category: 'review',
        title: '代码审查模板',
        description: '全面的代码审查，包括性能、安全和最佳实践',
        preview: `请对以下代码进行审查：
[代码片段]

重点关注：
1. 性能优化
2. 安全漏洞
3. 代码可维护性
4. 最佳实践`,
        content: `请对以下代码进行审查：
[代码片段]

重点关注：
1. 性能优化
2. 安全漏洞
3. 代码可维护性
4. 最佳实践

请提供：
1. 问题列表
2. 改进建议
3. 示例代码`,
        usage: 1560,
        rating: 4.9
    },
    {
        id: 4,
        category: 'document',
        title: '文档生成模板',
        description: '生成清晰的API文档和函数说明',
        preview: `请为以下代码生成文档：
[代码片段]

要求：
1. 函数说明
2. 参数说明
3. 返回值说明
4. 使用示例`,
        content: `请为以下代码生成文档：
[代码片段]

要求：
1. 函数说明
2. 参数说明
3. 返回值说明
4. 使用示例
5. 注意事项
6. 相关链接`,
        usage: 890,
        rating: 4.7
    }
];

// DOM 元素
const templatesGrid = document.querySelector('.templates-grid__container');
const searchInput = document.getElementById('template-search');
const filterButtons = document.querySelectorAll('.filter-button');
const modal = document.getElementById('template-modal');
const modalContent = modal.querySelector('.modal__body');
const modalClose = modal.querySelector('.modal__close');

// 渲染模板卡片
function renderTemplateCard(template) {
    return `
        <article class="template-card" data-id="${template.id}">
            <div class="template-card__header">
                <span class="template-card__category">${getCategoryName(template.category)}</span>
                <h3 class="template-card__title">${template.title}</h3>
                <p class="template-card__description">${template.description}</p>
            </div>
            <div class="template-card__content">
                <pre class="template-card__preview">${template.preview}</pre>
            </div>
            <div class="template-card__footer">
                <div class="template-card__stats">
                    <span class="template-card__stat">
                        <i class="fas fa-users"></i> ${template.usage}次使用
                    </span>
                    <span class="template-card__stat">
                        <i class="fas fa-star"></i> ${template.rating}
                    </span>
                </div>
                <button class="button button--primary">使用模板</button>
            </div>
        </article>
    `;
}

// 获取分类名称
function getCategoryName(category) {
    const categories = {
        'code': '代码生成',
        'debug': '调试优化',
        'review': '代码审查',
        'document': '文档生成'
    };
    return categories[category] || category;
}

// 渲染模板列表
function renderTemplates(templates) {
    templatesGrid.innerHTML = templates.map(renderTemplateCard).join('');
}

// 过滤模板
function filterTemplates(category, searchTerm) {
    return templates.filter(template => {
        const matchesCategory = category === 'all' || template.category === category;
        const matchesSearch = !searchTerm || 
            template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });
}

// 显示模板详情
function showTemplateDetails(templateId) {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    modalContent.innerHTML = `
        <div class="template-details">
            <h2 class="template-details__title">${template.title}</h2>
            <span class="template-details__category">${getCategoryName(template.category)}</span>
            <p class="template-details__description">${template.description}</p>
            
            <div class="template-details__content">
                <h3>模板内容</h3>
                <pre class="template-details__code">${template.content}</pre>
            </div>
            
            <div class="template-details__stats">
                <div class="template-details__stat">
                    <i class="fas fa-users"></i>
                    <span>${template.usage}次使用</span>
                </div>
                <div class="template-details__stat">
                    <i class="fas fa-star"></i>
                    <span>${template.rating}分</span>
                </div>
            </div>
            
            <div class="template-details__actions">
                <button class="button button--primary template-detail-copy-btn">
                    <i class="fas fa-copy"></i> 复制模板
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// 复制模板内容
function copyTemplate(templateId, btn) {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    navigator.clipboard.writeText(template.content).then(() => {
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = '复制成功';
            btn.classList.remove('button--primary');
            btn.classList.add('button--success');
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('button--success');
                btn.classList.add('button--primary');
                btn.disabled = false;
            }, 3000);
        }
    }).catch(err => {
        console.error('复制失败:', err);
    });
}

// 事件监听器
document.addEventListener('DOMContentLoaded', () => {
    // 初始渲染
    renderTemplates(templates);

    // 搜索功能
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value;
        const activeCategory = document.querySelector('.filter-button.active').dataset.category;
        const filteredTemplates = filterTemplates(activeCategory, searchTerm);
        renderTemplates(filteredTemplates);
    });

    // 分类筛选
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const category = button.dataset.category;
            const searchTerm = searchInput.value;
            const filteredTemplates = filterTemplates(category, searchTerm);
            renderTemplates(filteredTemplates);
        });
    });

    // 模板卡片点击
    templatesGrid.addEventListener('click', (e) => {
        const card = e.target.closest('.template-card');
        if (card) {
            // 判断是否点击了"使用模板"按钮
            if (e.target.classList.contains('button--primary')) {
                const templateId = parseInt(card.dataset.id);
                copyTemplate(templateId, e.target);
                e.stopPropagation();
                return;
            }
            const templateId = parseInt(card.dataset.id);
            showTemplateDetails(templateId);
        }
    });

    // 关闭模态框
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    // 弹窗内复制按钮
    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('template-detail-copy-btn')) {
            const templateId = parseInt(modalContent.querySelector('.template-details__title').textContent === templates[0].title ? templates[0].id : templates.find(t => t.title === modalContent.querySelector('.template-details__title').textContent).id);
            copyTemplate(templateId, e.target);
        }
    });

    // ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}); 