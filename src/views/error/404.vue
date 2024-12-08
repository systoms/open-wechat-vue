<template>
  <section class="content">
    <div class="error-page">
      <h2 class="headline text-yellow"> 404</h2>
      <div class="error-content">
        <h3><i class="fa fa-warning text-yellow"></i> 页面不存在</h3>
        <p>
          抱歉，您访问的页面不存在。
          您可以 <a @click="$router.go(-1)">返回上一页</a> 
          或者 <a @click="$router.push('/')">返回首页</a>。
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.error-page {
  width: 600px;
  margin: 100px auto;
}

.error-page > .headline {
  float: left;
  font-size: 100px;
  font-weight: 300;
}

.error-page > .error-content {
  margin-left: 190px;
  display: block;
}

.error-page > .error-content > h3 {
  font-weight: 300;
  font-size: 25px;
}

a {
  color: #3c8dbc;
  cursor: pointer;
}

a:hover {
  text-decoration: underline;
}
</style> 