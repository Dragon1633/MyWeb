document.addEventListener('DOMContentLoaded', function() {
    // 照片轮播
    const carouselData = [
        { image: 'imgs/me1.jpeg', caption: '探索未知' },
        { image: 'imgs/me2.jpeg', caption: '思考永恒' },
        { image: 'imgs/me3.jpeg', caption: '追求卓越' }
    ];

    const carouselWrapper = document.querySelector('.carousel-wrapper');
    let carouselHTML = '';

    // 将carouselData数组重复三次以实现无缝循环
    const extendedData = [...carouselData, ...carouselData, ...carouselData];

    extendedData.forEach((item, index) => {
        carouselHTML += `
            <div class="carousel-item ${index === 1 ? 'active' : ''}">
                <img src="${item.image}" alt="个人照片 ${(index % carouselData.length) + 1}">
                <p>${item.caption}</p>
            </div>
        `;
    });

    carouselWrapper.innerHTML = carouselHTML;

    const items = document.querySelectorAll('.carousel-item');
    const prevBtn = document.querySelector('.carousel-button.prev');
    const nextBtn = document.querySelector('.carousel-button.next');

    let currentIndex = 1;

    function showSlide(index) {     // 更新当前显示的图片
        items.forEach((item, i) => {
            item.classList.remove('active');
            const offset = i - index;
            item.style.transform = `translateX(${offset * 33}%) scale(${Math.abs(offset) === 1 ? 0.8 : 1}) translateZ(${Math.abs(offset) === 1 ? -50 : 0}px)`; // 调整位移和缩放
            if (i === index) {
                item.classList.add('active');
            }
        });
        carouselWrapper.style.transform = `translateX(-${30 * (index - 1)}%)`; // 调整整体位移
    }

    function nextSlide() {      // 用于显示下一张图片
        currentIndex++;
        if (currentIndex >= items.length - 1) {
            currentIndex = 1;
            carouselWrapper.style.transition = 'none';
            showSlide(currentIndex);
            setTimeout(() => {
                carouselWrapper.style.transition = 'transform 0.5s ease';
            }, 50);
        } else {
            showSlide(currentIndex);
        }
    }

    function prevSlide() {      // 用于显示上一张图片
        currentIndex--;
        if (currentIndex < 1) {
            currentIndex = items.length - 2;
            carouselWrapper.style.transition = 'none';
            showSlide(currentIndex);
            setTimeout(() => {
                carouselWrapper.style.transition = 'transform 0.5s ease';
            }, 50);
        } else {
            showSlide(currentIndex);
        }
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // 自动轮播
    setInterval(nextSlide, 5000);

    // 初始化轮播
    showSlide(currentIndex);

    // 添加标题动画
    const animateText = document.querySelector('.animate-text');
    setTimeout(() => {
        animateText.classList.add('visible');
    }, 500);

    // 了解更多按钮滚动到下一部分
    const learnMoreBtn = document.getElementById('learn-more');
    learnMoreBtn.addEventListener('click', function() {
        document.querySelector('#photo-carousel').scrollIntoView({
            behavior: 'smooth'
        });
    });

    // 滑动动画
    const slideElements = document.querySelectorAll('.slide-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    slideElements.forEach(el => observer.observe(el));

    // 作品集
    const videoData = [
        { src: 'imgs/p1.mp4' },
        { src: 'imgs/p2.mp4' },
        { src: 'imgs/p3.mp4' }
    ];

    const imageData = Array.from({length: 56}, (_, i) => ({
        src: `imgs/myworks/${i}.jpeg`
    }));

    const allWorks = [...videoData, ...imageData];
    const shuffledWorks = shuffleArray(allWorks);           // 随机排序
    const midpoint = Math.ceil(shuffledWorks.length / 2);

    const portfolio1 = shuffledWorks.slice(0, midpoint);
    const portfolio2 = shuffledWorks.slice(midpoint);

    function createPortfolioItem(item) {                //填充画廊
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        let media;
        if (item.src.endsWith('.mp4')) {
            media = document.createElement('video');
            media.src = item.src;
            media.loop = true;          // 循环播放
            media.muted = true;         // 静音
            media.playsInline = true;   //视频可以在页面内播放而不进入全屏模式
            media.addEventListener('loadedmetadata', () => {    // 添加 loadedmetadata 事件监听器，在元数据加载完毕后自动播放视频。
                media.play();
            });
        } else {
            media = document.createElement('img');
            media.src = item.src;
            media.alt = 'Portfolio work';   // 设置图片的替代文本，特殊情况使用
        }
        media.style.width = '100%';
        media.style.height = '100%';
        media.style.objectFit = 'cover';
        media.addEventListener('click', () => openModal(item.src));
        div.appendChild(media);
        return div;
    }

    const gallery1 = document.getElementById('portfolio-gallery-1');
    const gallery2 = document.getElementById('portfolio-gallery-2');

    function populateGallery(gallery, items) {
        gallery.innerHTML = ''; // 清空画廊
        items.forEach(item => {
            gallery.appendChild(createPortfolioItem(item));
        });
    }

    populateGallery(gallery1, portfolio1);
    populateGallery(gallery2, portfolio2);

    const toggleButtons = document.querySelectorAll('.portfolio-toggle');
    const galleries = document.querySelectorAll('.portfolio-gallery');

    toggleButtons.forEach((button, index) => {
        button.addEventListener('click', () => {
            toggleButtons.forEach(btn => btn.classList.remove('active'));
            galleries.forEach(gallery => {
                gallery.classList.remove('active');
                gallery.style.display = 'none'; // 隐藏所有画廊
            });
            button.classList.add('active');
            galleries[index].classList.add('active');
            galleries[index].style.display = 'flex'; // 显示当前选中的画廊
            
            // 将新激活的作品集滚动到顶部
            galleries[index].scrollTop = 0;
        });
    });

    // 确保初始状态下第一个画廊是可见的
    galleries[0].style.display = 'flex';

    function shuffleArray(array) {      // 随机打乱数组
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // 创建模态框-为了放大查看图片or视频
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="close">&times;</span>
        <img class="modal-content" id="modalImg">
        <video class="modal-content" id="modalVideo" controls></video>
    `;
    document.body.appendChild(modal);

    const modalImg = document.getElementById("modalImg");
    const modalVideo = document.getElementById("modalVideo");
    const closeBtn = document.getElementsByClassName("close")[0];

    function openModal(src) {
        modal.style.display = "flex";
        if (src.endsWith('.mp4')) {
            modalVideo.src = src;
            modalVideo.style.display = "block";
            modalImg.style.display = "none";
        } else {
            modalImg.src = src;
            modalImg.style.display = "block";
            modalVideo.style.display = "none";
        }
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
        modalVideo.pause();
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
            modalVideo.pause();
        }
    }

    // 社交媒体链接
    const socialLinks = [
        { icon: 'bilibili.svg', url: 'https://space.bilibili.com/435274967?spm_id_from=333.1007.0.0' },
        { icon: 'douyin.svg', url: 'https://www.douyin.com/user/self?from_tab_name=main' },
        { icon: 'xiaohongshu.svg', url: 'https://www.xiaohongshu.com/user/profile/5f6ebab5000000000101f712' }
    ];

    const socialContainer = document.querySelector('.social-links');
    socialLinks.forEach(link => {
        const socialIcon = document.createElement('a');
        socialIcon.href = link.url;
        socialIcon.target = '_blank';
        socialIcon.classList.add('social-icon');
        socialIcon.innerHTML = `<img src="icons/${link.icon}" alt="${link.icon.split('.')[0]}">`;
        socialContainer.appendChild(socialIcon);
    });

    // 初始化轮播
    showSlide(currentIndex);
});