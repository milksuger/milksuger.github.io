<template>
  <nav class="navigation">
    <div class="nav-header">
      <h2 class="nav-title">导航菜单</h2>
    </div>

    <ul class="nav-menu">
      <li class="nav-item">
        <router-link to="/" class="nav-link" active-class="active">
          <span class="nav-text">首页</span>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="/about" class="nav-link" active-class="active">
          <span class="nav-text">关于我们</span>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="/services" class="nav-link" active-class="active">
          <span class="nav-text">服务</span>
        </router-link>
      </li>

      <li class="nav-item">
        <router-link to="/contact" class="nav-link" active-class="active">
          <span class="nav-text">联系我们</span>
        </router-link>
      </li>
    </ul>

    <div class="nav-footer">
      <p class="footer-text">© 2025 Vue SPA</p>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
}
</script>

<style scoped>
.navigation {
  width: 250px;
  height: 100vh;
  background-color: #2c3e50;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
}

.nav-header {
  padding: 20px;
  border-bottom: 1px solid #34495e;
  background-color: #34495e;
}

.nav-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  text-align: center;
}

.nav-menu {
  flex: 1;
  list-style: none;
  padding: 0;
  margin: 0;
  padding-top: 20px;
}

.nav-item {
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #bdc3c7;
  text-decoration: none;
  transition: all 0.3s ease;
  border-left: 3px solid transparent;
}

.nav-link:hover {
  background-color: #34495e;
  color: white;
  border-left-color: #3498db;
}

.nav-link.active {
  background-color: #3498db;
  color: white;
  border-left-color: #2980b9;
}

.nav-text {
  font-size: 14px;
  font-weight: 500;
}

.nav-footer {
  padding: 20px;
  border-top: 1px solid #34495e;
  background-color: #34495e;
}

.footer-text {
  margin: 0;
  font-size: 12px;
  text-align: center;
  color: #95a5a6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navigation {
    width: 200px;
  }

  .nav-link {
    padding: 12px 15px;
  }

  .nav-text {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .navigation {
    width: 60px;
  }

  .nav-title {
    font-size: 14px;
  }

  .nav-text {
    display: none;
  }

  .nav-link {
    justify-content: center;
    padding: 15px 10px;
  }

  .footer-text {
    font-size: 10px;
  }
}
</style>
