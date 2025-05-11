document.addEventListener('DOMContentLoaded', function() {
    // 获取所有文档章节
    const sections = document.querySelectorAll('.doc-section');
    const navLinks = document.querySelectorAll('.sidebar-links a');

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        // 更新活动链接
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });

    // 代码高亮
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightBlock(block);
    });
}); 