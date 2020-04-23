$(document).ready(() => {

    // smooth scroll for back to top link
    $('a[href="#top"]').click((event) => {
        event.preventDefault();
        $('html, body').stop().animate({
            scrollTop: 0
        }, 'slow');
    });

    // Bootstrap 4 form validation
    const forms = document.querySelectorAll('form[novalidate].needs-validation');
    forms.forEach(form => {
        form.addEventListener('submit', (event) => {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    // Magnific Popup
    const imageOptions = {
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: false,
        fixedContentPos: true,
        mainClass: 'mfp-img-mobile mfp-with-zoom',
        image: {
            verticalFit: true
        },
        zoom: {
            enabled: true,
            duration: 200
        }
    };

    const galleryOptions = $.extend({}, imageOptions, {
        delegate: 'a',
        gallery: {
            enabled: true
        }
    });

    // initialize Magnific Popup for single images
    $('[data-popup="image"]').magnificPopup(imageOptions);

    // initialize Magnific Popup for image galleries
    $('[data-popup="image-gallery"]').each(function () {
        $(this).magnificPopup(galleryOptions);
    });

});
