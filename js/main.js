
class Drag {
	constructor (selector) {
		this.wrapper = $(selector)
		
		this.startY = 0
		this.disY = 0
		
		this.prevPage = null
		this.nextPage = null
		this.layer = null
		this.currentPage = null
		
		this.viewHeight = window.innerHeight
		this.viewWidth = window.innerWidth
		
		this.moveFlag = false
		
		this._init()
	}
	
	_init () {
		this._initBox()
		this._initEvent()
		
	}
	
	//初始化上下两个移动块
	_initBox () {
		if(this.prevPage){
			this.prevPage.css('top', 0)
			this.nextPage.css('top', 0)
			this.prevPage.css('z-index', 0)
			this.nextPage.css('z-index', 0)
		}
		
		this.currentPage = $(".current-page")
		this.currentPage.css('z-index', 50)
		this.prevPage = this.currentPage.prev().length === 0 ? $(".page").last() : $(".current-page").prev()
		this.nextPage = this.currentPage.next().length === 0 ? $(".page").first() : $(".current-page").next()
		
		this.prevPage.css('top', -this.viewHeight)
		this.nextPage.css('top', this.viewHeight)
		this.prevPage.css('z-index', 100)
		this.nextPage.css('z-index', 100)
	}
	
	//初始化事件
	_initEvent () {
		this.wrapper.on('touchstart', this._startFn.bind(this))
		this.wrapper.on('touchmove', this._moveFn.bind(this))
		this.wrapper.on('touchend', this._endFn.bind(this))
	}
	_startFn (ev) {
		this.startY = ev.changedTouches[0].clientY
	}
	_moveFn (ev) {
		var currentY = ev.changedTouches[0].clientY
		this.disY = currentY - this.startY
		if (this.disY > 0) {
			css(this.prevPage[0], 'translateY', this.disY)
			this.layer = this.prevPage
		} else {
			css(this.nextPage[0], 'translateY', this.disY)
			this.layer = this.nextPage
		}
	}
	_endFn (ev) {
		
		this.target = null
		if (this.disY > 0) {
			this.layer = this.prevPage
			this.target = this.viewHeight
		} else {
			this.layer = this.nextPage
			this.target = -this.viewHeight
		}
		
		var bl = this._isOutRange(this.disY)
		if(!bl){ // 如果在一定范围之内纵向移动，那么复归原位
			this.target = 0 
			this.moveFlag = false
		}else {
			this.moveFlag = true
		}
		this._move()
	}
	_isOutRange (num) {
		if(Math.abs(num) < 20){
			return false
		}
		return true
	}
	_move () {
		ZTween({
			el: this.layer[0],
			target: {
				'translateY': this.target
			},
			time:300,
			type:'linear',
			callBack: () => {
				if (!this._isOutRange(this.disY)) {
					return 
				}
				// 状态复原
				this.currentPage.removeClass('current-page')
				css(this.layer[0], 'translateY', 0)
				this.layer.addClass('current-page')
				
				this._initBox()
			}
		})	
	}
}
new Drag('.page-list')
