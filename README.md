# html5 简单活动页面封装

-----------------

## 运行

```html
<section id="wrapper">
	<div class="audio-wrapper">
		<audio loop="" src="..." id="media" autoplay="" preload="auto"></audio>
	</div>
	<section class="page-list">
		<div class="page page1 current-page">1</div>
		<div class="page page2">2</div>
		<div class="page page3">3</div>
		<div class="page page4">4</div>
	</section>
	<script src="js/ztween.js"></script>
	<script src="js/main.js"></script>
</section>
```
```javascript
new Drag('.page-list')
```

## Event
- slidein: 每次新页面覆盖旧页面的时候， 会触发这个事件
```javscript
$(".page1").on('slidein', function () {
	console.log(1)
})
```
