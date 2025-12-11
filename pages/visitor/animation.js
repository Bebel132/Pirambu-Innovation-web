$(document).ready(function(){
    const sections = $('section');
    const navItems = $('.nav-item');

    $(window).on('scroll', function (){
        const header = $('header');
        const scrollPosition = $(window).scrollTop();

        let activeSecctionIndex = 0;
        
        sections.each(function(i){
            const section = $(this);
            const sectionTop = section.offset().top - 96;
            const sectionBottom = sectionTop+ section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSecctionIndex = i;
                return false;
            }
        });

        navItems.removeClass('active');
        $(navItems[activeSecctionIndex]).addClass('active');
    });
});