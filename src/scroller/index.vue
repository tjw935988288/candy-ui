<template>
    <div class="scroller-view">
      <div class="scroller-wrap"
           ref="scroller-wrap"
           @touchstart="initPosition($event)"
           @touchmove="scroll($event)"
           @touchend="cacheScrollDistance($event)">
           <slot></slot>
      </div>
    </div>
</template>

<script>
const FIRST_FINGER = 0
const OVERFLOW_LEFT = -1
const ADJUST_INDEX = 4

export default {
  props: {
    fullScreen: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      elemsOfImgs: [],
      widthOfImg: 0,
      widthOfScreen: 0,
      startPosition: 0,
      preScrollDistance: 0,
      curScrollDistance: 0,
      maxScrollDistance: 0,
      currentIndexOfImg: 0
    }
  },
  watch: {
    currentIndexOfImg (newVal) {
      // 效率问题
      if (newVal === OVERFLOW_LEFT) this.currentIndexOfImg = 0
      if (newVal === this.elemsOfImgs.length + 1) this.currentIndexOfImg = this.elemsOfImgs.length
      this.adjustImgPosition(newVal)
    }
  },
  mounted () {
    this.initImgsWidth()
  },
  methods: {
    adjustImgPosition (currentIndexOfImg) {
      if (currentIndexOfImg === this.elemsOfImgs.length) {
        this.preScrollDistance = -(currentIndexOfImg * this.widthOfImg - this.widthOfScreen)
        this.scrollWrap.style.transform = `translateX(${this.preScrollDistance}px)`
      } else {
        this.preScrollDistance = -(currentIndexOfImg * this.widthOfImg)
        this.scrollWrap.style.transform = `translateX(${this.preScrollDistance}px)`
      }
      this.scrollWrap.style.transition = '.3s'
    },
    initPosition (e) {
      this.startPosition = e.touches[FIRST_FINGER].pageX
      this.$refs['scroller-wrap'].style.transition = '0s'
    },
    scroll (e) {
      const currentPosition = e.touches[FIRST_FINGER].pageX
      this.curScrollDistance = currentPosition - this.startPosition
      this.translateDistance = currentPosition - this.startPosition + this.preScrollDistance
      this.$refs['scroller-wrap'].style.transform = `translateX(${this.translateDistance}px)`
    },
    cacheScrollDistance (e) {
      this.preScrollDistance = this.curScrollDistance + this.preScrollDistance
      this.scrollWrap = this.$refs['scroller-wrap']
      if (this.preScrollDistance > 0) {
        this.currentIndexOfImg = OVERFLOW_LEFT
        return
      } else if (Math.abs(this.preScrollDistance) > this.maxScrollDistance) {
        this.currentIndexOfImg = this.elemsOfImgs.length + 1
        return
      }
      if (this.fullScreen) {
        if (Math.abs(this.curScrollDistance) > this.widthOfScreen / ADJUST_INDEX) {
          if (this.curScrollDistance > 0) {
            this.currentIndexOfImg--
          } else {
            this.currentIndexOfImg++
          }
        } else {
          this.adjustImgPosition(this.currentIndexOfImg)
        }
      }
    },
    initImgsWidth () {
      this.widthOfScreen = document.documentElement.clientWidth
      this.elemsOfImgs = this.$refs['scroller-wrap'].children
      let scrollerInnerWidth
      if (this.fullScreen) {
        this.widthOfImg = this.widthOfScreen
        for (let elemOfImgs of this.elemsOfImgs) {
          elemOfImgs.style.width = `${this.widthOfImg}px`
        }
      } else {
        this.widthOfImg = this.elemsOfImgs[0].clientWidth + parseInt(window.getComputedStyle(this.elemsOfImgs[0]).marginLeft) + parseInt(window.getComputedStyle(this.elemsOfImgs[0]).marginRight)
      }
      scrollerInnerWidth = this.elemsOfImgs.length * this.widthOfImg
      this.maxScrollDistance = scrollerInnerWidth - this.widthOfScreen
      this.$refs['scroller-wrap'].style.width = `${scrollerInnerWidth}px`
    }
  }
}
</script>

<style lang="less" scoped>
    @import './index.less';
</style>
