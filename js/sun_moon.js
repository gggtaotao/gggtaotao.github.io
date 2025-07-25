// 页面加载完成后初始化主题模式
document.addEventListener('DOMContentLoaded', initThemeMode);

// 初始化主题模式：从localStorage读取并应用
function initThemeMode() {
  // 读取本地存储的主题模式（默认light）
  const savedTheme = localStorage.getItem('theme') || 'dark';
  
  // 应用保存的模式到页面
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // 同步更新切换按钮的图标（太阳/月亮）
  const modeIcon = document.getElementById('modeicon');
  if (modeIcon) {
    modeIcon.setAttribute('xlink:href', savedTheme === 'dark' ? '#icon-sun' : '#icon-moon');
  }
}

// 原有切换模式的函数（保持动画逻辑不变）
function switchNightMode() {
  // 创建动画层
  const darkSky = document.createElement('div');
  darkSky.className = 'Cuteen_DarkSky';
  darkSky.innerHTML = `
    <div class="Cuteen_DarkPlanet">
      <div id="sun"></div>
      <div id="moon"></div>
    </div>
  `;
  document.body.appendChild(darkSky);

  // 获取当前主题状态
  const html = document.documentElement;
  const isDark = html.getAttribute('data-theme') === 'dark';

  // 获取太阳/月亮元素并设置初始状态
  const sun = darkSky.querySelector('#sun');
  const moon = darkSky.querySelector('#moon');
  
  // 设置初始透明度（避免闪烁）
  if (isDark) {
    sun.style.opacity = "0";
    moon.style.opacity = "1";
  } else {
    sun.style.opacity = "1";
    moon.style.opacity = "0";
  }

  // 切换主题状态并保存到localStorage
  const newTheme = isDark ? 'light' : 'dark';
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); // 关键：保存到本地存储
  
  // 更新切换按钮图标
  const modeIcon = document.getElementById('modeicon');
  if (modeIcon) {
    modeIcon.setAttribute('xlink:href', newTheme === 'dark' ? '#icon-sun' : '#icon-moon');
  }

  // 强制重排，确保过渡效果触发
  darkSky.offsetWidth;

  // 执行太阳/月亮切换动画
  setTimeout(() => {
    if (sun && moon) {
      sun.style.transition = 'opacity 1s ease-in-out';
      moon.style.transition = 'opacity 1s ease-in-out';
      
      if (isDark) {
        sun.style.opacity = "1";
        moon.style.opacity = "0";
      } else {
        sun.style.opacity = "0";
        moon.style.opacity = "1";
      }
    }

    // 动画结束后淡出背景
    setTimeout(() => {
      if (darkSky) {
        darkSky.style.transition = 'opacity 1s ease-in-out';
        darkSky.style.opacity = "0";
        
        // 完全淡出后移除元素并显示通知
        setTimeout(() => {
          if (darkSky.parentNode) {
            darkSky.parentNode.removeChild(darkSky);
          }
          
          if (isDark) {
            showNotification("开灯啦🌞", "当前已成功切换至白天模式！");
          } else {
            showNotification("关灯啦🌙", "当前已成功切换至夜间模式！");
          }
        }, 1000);
      }
    }, 1500);
  }, 100);

  // 同步第三方组件（原有逻辑不变）
  typeof utterancesTheme === 'function' && utterancesTheme();
  typeof FB === 'object' && window.loadFBComment();
  window.DISQUS && document.getElementById('disqus_thread').children.length && 
    setTimeout(() => window.disqusReset(), 200);
}

// 通知函数（原有逻辑不变）
function showNotification(title, message) {
  new Vue({
    data: function() {
      this.$notify({
        title,
        message,
        position: 'top-left',
        offset: 50,
        showClose: true,
        type: "success",
        duration: 5000
      });
    }
  });
}