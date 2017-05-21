
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
		
		this.isSwiping = false
		
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
		if(this.isSwiping){
			return
		}
		this.startY = ev.changedTouches[0].clientY
	}
	_moveFn (ev) {
		if(this.isSwiping){
			return
		}
		
		var currentY = ev.changedTouches[0].clientY
		this.disY = currentY - this.startY
		
		this._dealMoveFn()
	}
	_dealMoveFn () {
		if (this.disY > 0) {
			if(css(this.nextPage[0], 'translateY') !== 0){ //有可能prevPage滑动时nextPage没有回到0的位置，校正
				css(this.nextPage[0], 'translateY', 0)
			}
			
			css(this.prevPage[0], 'translateY', this.disY)
			this.layer = this.prevPage
		} else {
			if(css(this.prevPage[0], 'translateY') !== 0){
				css(this.prevPage[0], 'translateY', 0)
			}
			css(this.nextPage[0], 'translateY', this.disY)
			this.layer = this.nextPage
		}
		
		
	}
	_endFn (ev) {
		if(this.isSwiping){
			return
		}
		if(this.disY === 0) {
			return
		}
		this.target = null
		this._dealEnd()
	}
	_dealEnd () {
		if (this.disY > 0) {
			this.layer = this.prevPage
			this.target = this.viewHeight
		} else {
			this.layer = this.nextPage
			this.target = -this.viewHeight
		}
		
		if(!this._isOutRange(this.disY)){ // 如果在一定范围之内纵向移动，那么复归原位
			this.target = 0 
		}else {
			this.layer.triggerHandler('slidein')
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
		this.isSwiping = true
		var time = this._isOutRange(this.disY)? 300: 100
		ZTween({
			el: this.layer[0],
			target: {
				'translateY': this.target
			},
			time,
			type:'linear',
			callBack: () => {
				this.isSwiping = false
				if (!this._isOutRange(this.disY)) {
					return 
				}
				
				// 状态复原
				this.currentPage.removeClass('current-page')
				css(this.layer[0], 'translateY', 0)
				this.layer.addClass('current-page')
				
				this.disY = 0
				
				this._initBox()
			}
		})
	}
}
new Drag('.page-list')
$(".page1").on('slidein', function () {
	console.log(1)
})
$(".page2").on('slidein', function () {
	console.log(2)
})