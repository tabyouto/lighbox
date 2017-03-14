window.Cready = (function (fn) {
        return fn;
    })(function() {
        function LightBox() {
            this.positionTop= 50; //距离顶部
            this.srcArr = [];
            this.index = 0;
            this.render = this.getSingle(this.build);
            this.init();
        }

        LightBox.prototype.init = function() {
            var that = this;
            this.$$imgArr = document.querySelectorAll('.entry-content p img'); //此处为你的blog 文章外层容器
            this.$$imgArr.forEach(function(item) {
                item.style.setProperty('cursor','pointer');
                item.addEventListener('click',function() {
                    that.showBox(this);
                });
            })
        };

        /**
         * 单例模式
         * @param fn
         * @returns {Function}
         */
        LightBox.prototype.getSingle = function (fn) {
            var result;
            return function() {
                return result || (result = fn.apply(this,arguments));
            }
        };

        LightBox.prototype.showBox = function (item) {
            var windowWidth,windowHeight,maxImageWidth,maxImageHeight,imageWidth,imageHeight;
            var self = this;
            var preloader = new Image();
            preloader.onload = function () {
                windowHeight = document.documentElement.clientHeight;
                windowWidth  = document.documentElement.clientWidth;

                maxImageWidth  = windowWidth - 5 - 5 - 1 - 1 - 20;
                maxImageHeight  = windowHeight - 5 - 5 - 1 - 1 - 120;

                document.getElementById('lb-img').style.width = preloader.width + 'px';
                document.getElementById('lb-img').style.height = preloader.height + 'px';

                // Is the current image's width or height is greater than the maxImageWidth or maxImageHeight
                // option than we need to size down while maintaining the aspect ratio.
                console.log(preloader.width);
                if ((preloader.width > maxImageWidth) || (preloader.height > maxImageHeight)) {
                    if ((preloader.width / maxImageWidth) > (preloader.height / maxImageHeight)) {
                        imageWidth  = maxImageWidth;
                        imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10);
                        document.getElementById('lb-img').style.width = imageWidth + 'px';
                        document.getElementById('lb-img').style.height = imageHeight + 'px';
                    } else {
                        imageHeight = maxImageHeight;
                        imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10);
                        document.getElementById('lb-img').style.width = imageWidth + 'px';
                        document.getElementById('lb-img').style.height = imageHeight + 'px';
                    }
                }
                //modify container size
                self.sizeContainer(document.getElementById('lb-img').offsetWidth,document.getElementById('lb-img').offsetHeight,function () {
                    document.getElementById('lb-img').setAttribute('src',item.currentSrc);
                });

            };
            preloader.src = item.currentSrc;

            var tmp = this.render();
            if(tmp) { //如果已经创建则直接展示
                document.getElementById('mask').style.setProperty('display','block');
            }

        };

        LightBox.prototype.sizeContainer = function (imageWidth,imageHeight,fn) {
            var self = this;
            var oldWidth  = document.getElementById('lb-container').clientWidth;
            var oldHeight = document.getElementById('lb-container').clientHeight;
            var newWidth  = imageWidth + 1 + 1; //2px border
            var newHeight = imageHeight + 1 + 1;

            function postResize() {
                document.getElementById('lb-container').style.width = newWidth + 'px';
                document.getElementById('lb-container').style.height = newHeight + 'px';
            }

            if (oldWidth !== newWidth || oldHeight !== newHeight) {
                postResize();
            } else {
                postResize();
            }
            fn && fn();
        };
        /**
         * 绑定UI事件
         */
        LightBox.prototype.bindUI = function () {
            //设置遮罩点击关闭
            var $$mask = document.getElementById('mask');
            var $$lbContainer = document.getElementById('lb-container');
            $$lbContainer.addEventListener('click',function (e) {
                e.stopPropagation();
            });
            $$mask.addEventListener('click',function(e) {
                $$mask.style.setProperty('display','none');
            });
        };

        /**
         * 创建遮罩
         */
        LightBox.prototype.build = function () {
            var fragment = document.createDocumentFragment();
            var maskNode = document.createElement("div");
            maskNode.setAttribute('id','mask');
            maskNode.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,.6);z-index:555';

            //创建外层container容器
            var container = document.createElement('div');
            container.setAttribute('id','container-wrap');
            container.style['position'] = 'absolute';
            container.style['width'] = '100%';
            container.style['top'] = this.positionTop + window.pageXOffset + 'px';
            container.style['left'] = '0px';
            maskNode.appendChild(container);

            //包裹img的容器
            var imgContainer = document.createElement('div');
            imgContainer.setAttribute('id','lb-container');
            imgContainer.style.cssText = 'position: relative;width:250px;height:250px;border-radius:3px;margin:0 auto;text-align:center;background-color: #fff';
            container.appendChild(imgContainer);

            //创建img标签
            var img = document.createElement('img');
            img.style.cssText = 'border: 3px solid #fff; border-radius:3px;box-sizing:border-box;';
            img.setAttribute('src',"data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==");
            img.setAttribute('id',"lb-img");
            imgContainer.appendChild(img);


            fragment.appendChild(maskNode); //临时保存

            document.body.appendChild(fragment); //填充到body
            LightBox.prototype.bindUI();
            return fragment;
        };

        return new LightBox();
    });