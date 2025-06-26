document.addEventListener('DOMContentLoaded', () => {
    // 初始化代码高亮
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });

    // 示例过滤功能
    const filterButtons = document.querySelectorAll('.filter-button');
    const exampleCards = document.querySelectorAll('.example-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新按钮状态
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 获取选中的类别
            const category = button.dataset.category;

            // 过滤示例卡片
            exampleCards.forEach(card => {
                if (category === 'all' || card.dataset.category === category) {
                    card.style.display = 'block';
                    // 添加淡入动画
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 为所有代码块添加复制按钮
    document.querySelectorAll('pre').forEach((pre) => {
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '<i class="fas fa-copy"></i>';
        button.setAttribute('aria-label', '复制代码');
        
        pre.style.position = 'relative';
        pre.appendChild(button);

        button.addEventListener('click', async () => {
            const code = pre.querySelector('code').textContent;
            try {
                await navigator.clipboard.writeText(code);
                showNotification('代码已复制到剪贴板！', 'success');
            } catch (err) {
                showNotification('复制失败，请手动复制。', 'error');
            }
        });
    });

    // 添加代码行号
    document.querySelectorAll('.example-card__code').forEach(block => {
        const code = block.textContent;
        const lines = code.split('\n');
        const lineNumbers = document.createElement('div');
        lineNumbers.className = 'line-numbers';
        
        lines.forEach((_, index) => {
            const lineNumber = document.createElement('span');
            lineNumber.textContent = index + 1;
            lineNumbers.appendChild(lineNumber);
        });

        block.parentNode.insertBefore(lineNumbers, block);
    });

    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    document.querySelector('.nav__search').appendChild(searchResults);

    // 搜索数据
    const searchData = [
        {
            title: '异步函数处理',
            description: '使用async/await处理异步请求的示例',
            category: 'JavaScript',
            element: document.querySelector('[data-category="javascript"]')
        },
        {
            title: '列表推导式',
            description: 'Python列表推导式的使用示例',
            category: 'Python',
            element: document.querySelector('[data-category="python"]')
        },
        {
            title: '响应式卡片',
            description: '响应式卡片布局示例',
            category: 'HTML/CSS',
            element: document.querySelector('[data-category="html"]')
        },
        {
            title: '提示词编写',
            description: '学习如何编写更好的提示词',
            category: '最佳实践',
            element: document.querySelector('.practice-card:nth-child(1)')
        },
        {
            title: '代码审查',
            description: '代码审查的最佳实践',
            category: '最佳实践',
            element: document.querySelector('.practice-card:nth-child(2)')
        },
        {
            title: '错误处理',
            description: '错误处理的最佳实践',
            category: '最佳实践',
            element: document.querySelector('.practice-card:nth-child(3)')
        },
        {
            title: '性能优化',
            description: '性能优化的最佳实践',
            category: '最佳实践',
            element: document.querySelector('.practice-card:nth-child(4)')
        }
    ];

    // 搜索函数
    function performSearch(query) {
        query = query.toLowerCase();
        const results = searchData.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.category.toLowerCase().includes(query)
        );

        // 显示搜索结果
        searchResults.innerHTML = '';
        if (results.length > 0) {
            results.forEach(result => {
                const resultItem = document.createElement('div');
                resultItem.className = 'search-result-item';
                resultItem.innerHTML = `
                    <div class="search-result-item__title">${result.title}</div>
                    <div class="search-result-item__description">${result.description}</div>
                    <div class="search-result-item__category">${result.category}</div>
                `;
                resultItem.addEventListener('click', () => {
                    result.element.scrollIntoView({ behavior: 'smooth' });
                    searchResults.classList.remove('active');
                    searchInput.value = '';
                });
                searchResults.appendChild(resultItem);
            });
            searchResults.classList.add('active');
        } else {
            searchResults.classList.remove('active');
        }
    }

    // 搜索事件监听
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });

    searchButton.addEventListener('click', () => {
        performSearch(searchInput.value);
    });

    // 点击外部关闭搜索结果
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav__search')) {
            searchResults.classList.remove('active');
        }
    });

    // 键盘导航
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        } else if (e.key === 'Escape') {
            searchResults.classList.remove('active');
            searchInput.value = '';
        }
    });
});

// 通知系统
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    // 添加显示动画
    setTimeout(() => notification.classList.add('show'), 100);

    // 自动移除
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// 添加动画样式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .copy-button {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
    }

    pre:hover .copy-button {
        opacity: 1;
    }

    .copy-button:hover {
        background: white;
    }

    .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 4px;
        background-color: #4CAF50;
        color: white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transform: translateX(100%);
        opacity: 0;
        transition: transform 0.3s ease, opacity 0.3s ease;
    }

    .notification.show {
        transform: translateX(0);
        opacity: 1;
    }

    .notification--error {
        background-color: #f44336;
    }

    .line-numbers {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        width: 3rem;
        background-color: rgba(0, 0, 0, 0.05);
        border-right: 1px solid rgba(0, 0, 0, 0.1);
        padding: 1rem 0;
        text-align: right;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        color: #666;
        user-select: none;
    }

    .line-numbers span {
        display: block;
        padding: 0 0.5rem;
    }

    pre {
        padding-left: 3rem !important;
    }
`;
document.head.appendChild(style); 