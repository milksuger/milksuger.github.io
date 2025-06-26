document.addEventListener('DOMContentLoaded', () => {
    // 初始化代码高亮
    hljs.highlightAll();

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

    // 代码复制功能
    document.querySelectorAll('.example-card__code').forEach(block => {
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = '<i class="fas fa-copy"></i>';
        copyButton.setAttribute('aria-label', '复制代码');
        
        block.parentNode.style.position = 'relative';
        block.parentNode.appendChild(copyButton);

        copyButton.addEventListener('click', async () => {
            const code = block.textContent;
            try {
                await navigator.clipboard.writeText(code);
                showNotification('代码已复制到剪贴板', 'success');
            } catch (err) {
                showNotification('复制失败，请手动复制', 'error');
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
}); 