<script setup>

</script>

<template>
<el-footer>
  <footer class="main-footer">
    <div class="pull-right hidden-xs">
      <b>Version</b> 2.4.18
    </div>
    <strong>Copyright &copy; 2014-2019 <a href="https://adminlte.io">AdminLTE</a>.</strong> All rights
    reserved.
  </footer>
</el-footer>
</template>

<style scoped lang="less">
.el-footer {
  padding: 0;
  height: 50px;
}
.main-footer {
  width: 100%;
  padding: 15px;
  color: #444;
  background: #fff;
  font-size: 13px;
  line-height: 1.5;

  .pull-right {
    float: right;
    
    b {
      font-weight: 600;
      font-size: 13px;
    }
  }

  strong {
    font-weight: 600;
    font-size: 13px;
  }

  a {
    color: #3c8dbc;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>