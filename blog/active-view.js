// modified from https://codepen.io/davidicus/pen/mEVdPN

(function () {
    'use strict';
    var SectionScroller = {
        anchorTops: [],

        el: {
            anchorLinks: document.querySelectorAll('.toc a'),
            // anchorLinks: document.querySelector(a[0].hash)
        },
        
        forEach: function(array, callback, scope) {
            for (var i = 0, ii = array.length; i < ii; i++) {
                callback.call(scope, i, array[i]);
            }
        },

        throttle: function (fn, threshhold, scope) {
          threshhold = threshhold || (threshhold = 10);
          var last;
          var deferTimer;
          return function () {
            var context = scope || this;
            var now = +new Date();
            var args = arguments;
            if (last && now < last + threshhold) {
              // hold on to it
              clearTimeout(deferTimer);
              deferTimer = setTimeout(function () {
                last = now;
                fn.apply(context, args);
              }, threshhold);
            } else {
              last = now;
              fn.apply(context, args);
            }
          };
        },
        
        mathSign: function (x) {
            x = +x; // convert to a number
            if (x === 0 || isNaN(x)) {
                return x;
            }
            return x > 0 ? 1 : -1;
        },

        anchorGetter: function () {
            var SS = SectionScroller;
            for (var i = 0, max = SS.el.anchors.length; i < max; i++) {
                SS.anchorTops[i] = SS.el.anchors[i].offsetTop;
            }
            for (var j = 0, jj = SS.anchorTops.length; j < jj; j++) {
                if (SS.anchorTops[j] - 1 < window.scrollY) {
                    for (var x = 0, xx = SS.el.anchors.length; x < xx; x++) {
                        SS.el.anchorLinks[x].classList.remove('selected');
                    }
                    SS.el.anchorLinks[j].classList.add('selected');
                }
            }
        },
        
        smooth: function (e) {
            var id = e.currentTarget.getAttribute('href');
            var node = document.querySelector(id);
            var nodeTop = node.offsetTop;
            var winTop = window.scrollY;
            var sign = SectionScroller.mathSign(nodeTop);
            var scrollAmnt;
            var down; 
            if (nodeTop > winTop) {
                down = true;
                scrollAmnt = nodeTop - winTop;
            } else {
                down = false;
                scrollAmnt = Math.abs(winTop - nodeTop);
            }
            
            var scroller = function () {
                if (down) {
                    window.scrollTo(0, window.scrollY + 50);
                } else {
                    window.scrollTo(0, window.scrollY - 50);
                }
                scrollAmnt-=50;
                if (scrollAmnt > 0)  {
                    window.requestAnimationFrame(scroller);
                }
            };
            window.requestAnimationFrame(scroller);
            e.preventDefault();
        },
        
        smoothScroll: function(e) {
            var id = e.currentTarget.getAttribute('href');
            var node = document.querySelector(id);
            var scrollContainer = node;
            do { //find scroll container
                scrollContainer = scrollContainer.parentNode;
                if (!scrollContainer) return;
                scrollContainer.scrollTop += 1;
            } while (scrollContainer.scrollTop === 0);

            var targetY = 0;
            do { //find the top of target relatively to the container
                if (node == scrollContainer) break;
                targetY += node.offsetTop;
            } while (node === node.offsetParent);

            var scroll = function(c, a, b, i) {
                i++; if (i > 30) return;
                c.scrollTop = a + (b - a) / 30 * i;
                setTimeout(function(){ scroll(c, a, b, i); }, 20);
            };
            // start scrolling
            scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
            e.preventDefault();
        },

        events: function () {
            var SS = SectionScroller;
            window.addEventListener('scroll', SS.throttle(SS.anchorGetter, 1));
            SS.forEach(SS.el.anchorLinks, function (index, link) {
                link.addEventListener('click', SS.smooth);
            });
        },

        assignAnchors: function(){
            SectionScroller.el.anchors = []
            SectionScroller.el.anchorLinks.forEach(function(i){SectionScroller.el.anchors.push(document.querySelector(i.hash))})
        },

        init: function () {
            SectionScroller.assignAnchors();
            SectionScroller.anchorGetter();
            SectionScroller.events();
        }
    };

    SectionScroller.init();
})();


// TODO : block current url 
// $(document).ready(function () {
//     $("#all-posts-container a").each(function(){
//         //set all menu items to 'black
//         // $(this).css("color","black");

//         var linkPath=$(this).attr("href");
//         var relativePath=window.location.pathname.replace('http://'+window.location.hostname,'');

//         console.log(linkPath)
//         console.log(relativePath)

//         console.log(linkPath==relativePath)

//         //set the <a> with the same path as the current address to blue
//         if(linkPath==relativePath)
//             console.log("here")
//             console.log($(this))
//             $(this).classList.add("disabled");
//     });

//     $('a.disabled').click(function(e){
//         e.preventDefault();
//     });
// });

