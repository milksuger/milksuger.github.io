// 导航菜单切换
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.querySelector('.nav__toggle');
    const navMenu = document.querySelector('.nav__menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });
    }

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // 如果导航菜单是打开的，点击后关闭它
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // 表单提交处理
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            try {
                // 这里可以添加实际的表单提交逻辑
                console.log('表单数据:', data);
                
                // 显示成功消息
                alert('感谢您的留言！我们会尽快回复您。');
                contactForm.reset();
            } catch (error) {
                console.error('提交表单时出错:', error);
                alert('抱歉，提交失败。请稍后重试。');
            }
        });
    }

    // 添加滚动动画
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.feature-card, .example-card, .practice-card');
        
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            // 当元素进入视口时添加动画类
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    // 初始化滚动动画
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // 初始检查

    // 添加代码高亮
    const codeBlocks = document.querySelectorAll('pre code');
    codeBlocks.forEach(block => {
        // 这里可以添加代码高亮逻辑
        // 例如使用 highlight.js 或其他库
    });
}); 