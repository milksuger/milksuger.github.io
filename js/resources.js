document.addEventListener('DOMContentLoaded', () => {
    // 获取所有分类按钮和资源卡片
    const categoryButtons = document.querySelectorAll('.resource-nav__btn');
    const resourceCards = document.querySelectorAll('.resource-card');

    // 为每个分类按钮添加点击事件
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有按钮的 active 类
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // 为当前点击的按钮添加 active 类
            button.classList.add('active');

            // 获取选中的分类
            const selectedCategory = button.dataset.category;

            // 过滤并显示相应的资源卡片
            resourceCards.forEach(card => {
                // 添加淡出动画
                card.style.animation = 'none';
                card.offsetHeight; // 触发重绘
                card.style.animation = 'fadeInUp 0.6s ease-out forwards';

                if (selectedCategory === 'all' || card.dataset.category === selectedCategory) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 添加滚动动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有资源卡片
    resourceCards.forEach(card => {
        observer.observe(card);
    });

    // 添加平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 