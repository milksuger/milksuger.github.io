// 项目数据
const projects = [
    {
        id: 1,
        title: "2048游戏",
        description: "使用HTML5和JavaScript开发的经典2048游戏",
        category: "game",
        tags: ["JavaScript", "HTML5", "CSS3"],
        details: {
            features: [
                "响应式设计，支持移动端",
                "本地存储最高分",
                "触摸屏支持",
                "动画效果"
            ],
            technologies: ["HTML5", "CSS3", "JavaScript", "LocalStorage"],
            link: "game_2048/index.html"
        }
    },
    {
        id: 2,
        title: "五子棋游戏",
        description: "基于Canvas开发的在线五子棋游戏",
        category: "game",
        tags: ["Canvas", "JavaScript", "HTML5"],
        details: {
            features: [
                "Canvas绘制棋盘",
                "胜负判定",
                "悔棋功能",
                "重新开始"
            ],
            technologies: ["HTML5 Canvas", "JavaScript", "CSS3"],
            link: "game_wzq/index.html"
        }
    },
    {
        id: 3,
        title: "个人网站",
        description: "使用HTML、CSS和JavaScript开发的个人网站",
        category: "web",
        tags: ["HTML5", "CSS3", "JavaScript"],
        details: {
            features: [
                "响应式设计",
                "作品集展示",
                "游戏集成",
                "博客系统"
            ],
            technologies: ["HTML5", "CSS3", "JavaScript", "jQuery"],
            link: "index.html"
        }
    }
];

// 初始化页面
document.addEventListener('DOMContentLoaded', () => {
    loadProjects('all');
    setupFilterButtons();
    setupModal();
});

// 加载项目
function loadProjects(category) {
    const grid = document.querySelector('.portfolio-grid');
    grid.innerHTML = '';

    const filteredProjects = category === 'all' 
        ? projects 
        : projects.filter(project => project.category === category);

    filteredProjects.forEach(project => {
        const projectCard = createProjectCard(project);
        grid.appendChild(projectCard);
    });
}

// 创建项目卡片
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
        <div class="project-info">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;

    card.addEventListener('click', () => showProjectDetails(project));
    return card;
}

// 设置筛选按钮
function setupFilterButtons() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            loadProjects(button.dataset.filter);
        });
    });
}

// 设置模态框
function setupModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.close-modal');

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// 显示项目详情
function showProjectDetails(project) {
    const modal = document.getElementById('project-modal');
    const modalBody = modal.querySelector('.modal-body');

    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p>${project.description}</p>
        
        <h3>主要功能</h3>
        <ul>
            ${project.details.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>

        <h3>使用技术</h3>
        <div class="project-tags">
            ${project.details.technologies.map(tech => `<span class="project-tag">${tech}</span>`).join('')}
        </div>

        <div style="margin-top: 2rem;">
            <a href="${project.details.link}" class="btn" target="_blank">查看项目</a>
        </div>
    `;

    modal.style.display = 'block';
} 