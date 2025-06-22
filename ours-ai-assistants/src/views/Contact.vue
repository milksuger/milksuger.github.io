<template>
  <div class="page-content">
    <h1>联系我们</h1>

    <div class="contact-container">
      <div class="contact-info">
        <h2>联系方式</h2>
        <div class="info-item">
          <h3>邮箱</h3>
          <p>contact@example.com</p>
        </div>

        <div class="info-item">
          <h3>电话</h3>
          <p>+86 138-0000-0000</p>
        </div>

        <div class="info-item">
          <h3>地址</h3>
          <p>北京市朝阳区某某大厦</p>
        </div>

        <div class="info-item">
          <h3>工作时间</h3>
          <p>周一至周五 9:00-18:00</p>
        </div>
      </div>

      <div class="contact-form">
        <h2>发送消息</h2>
        <form @submit.prevent="submitForm">
          <div class="form-group">
            <label for="name">姓名</label>
            <input type="text" id="name" v-model="form.name" required />
          </div>

          <div class="form-group">
            <label for="email">邮箱</label>
            <input type="email" id="email" v-model="form.email" required />
          </div>

          <div class="form-group">
            <label for="message">消息</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="5"
              required
            ></textarea>
          </div>

          <button type="submit" class="submit-btn">发送消息</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Contact',
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: '',
      },
    }
  },
  methods: {
    submitForm() {
      alert('消息已发送！（这是一个演示）')
      // 重置表单
      this.form = {
        name: '',
        email: '',
        message: '',
      }
    },
  },
}
</script>

<style scoped>
.page-content {
  padding: 20px;
}

.contact-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-top: 20px;
}

.contact-info {
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
}

.info-item {
  margin: 20px 0;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid #007bff;
}

.contact-form {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e9ecef;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #495057;
}

input,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 14px;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 12px 30px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.submit-btn:hover {
  background-color: #0056b3;
}

h1 {
  color: #2c3e50;
  margin-bottom: 20px;
}

h2 {
  color: #495057;
  margin-bottom: 20px;
}

h3 {
  color: #6c757d;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

@media (max-width: 768px) {
  .contact-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}
</style>
