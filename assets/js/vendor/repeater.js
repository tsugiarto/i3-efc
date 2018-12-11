jQuery(document).ready(function($) {
// BEN 08.02 START
    // repeater function
    /* data-repeater-max="[integer]"
     */
    var $repeaterForm = $('.js-form-repeater');

    function repeaterAdd($button, event) {
        var $this = $button.parents('.js-form-repeater'),
            $repeaters = $this.find('.repeaters'),
            $repeater = $repeaters.find('.repeater'),
            $repeaterSource = $this.find('.repeater-source'),
            $repeaterAlert = $this.find('.form-repeater-alert'),
            repeaterMax = $this.data('repeater-max') || 99,
            repeaterCurrent = $repeater.length - 1;

        function generateID(repeater, type) {
            var regex = /((?!^)\{.*?\})/;
            var nameSuffix = $(repeater).data('repeater-'+ type).split(regex);
            nameSuffix.forEach(function(element, n) {
                if (element === '{timestamp}') {
                    nameSuffix[n] = timestamp;
                }
            });
            nameSuffix = nameSuffix.join('');
            $(repeater).attr(type, nameSuffix);
        }

        if (repeaterCurrent < repeaterMax) {
            var $repeaterNew = $repeaterSource.clone().appendTo($repeaters).removeClass('repeater-source'),
                repeaterId = $repeaterNew.find('[data-repeater-id]'),
                repeaterName = $repeaterNew.find('[data-repeater-name]'),
                timestamp = $.now();

            if (repeaterId) {
                repeaterId.each(function() {
                    generateID(this, 'id');
                });
            }

            if (repeaterName) {
                repeaterName.each(function() {
                    generateID(this, 'name');
                });
            }

            repeaterCurrent+=1;
        } else {
            $repeaterAlert.show();
        }
        event.preventDefault();
    }

    function repeaterRemove($button, event) {
        var $this = $button.parents('.js-form-repeater'),
            $repeater = $this.find('.repeater'),
            $repeaterAlert = $this.parents('.js-form-repeater').find('.form-repeater-alert'),
            repeaterCurrent = $repeater.length - 1;

        $button.parents('.repeater').remove();
        $repeaterAlert.hide();
        repeaterCurrent-=1;
        event.preventDefault();
    }

    var ini_val;
    $repeaterForm.on('click', '.form-repeater-add', function(event) {
        repeaterAdd($(this), event);

        $('.js-form-repeater .repeater').each(function(index, value) {
            if(index != 0) {
                $(this).find('select.input').addClass('js-select2');
            }
        });

        ini_val = setTimeout(function(){
 
            $('.js-select2').each(function() {
                $(this).select2({ width: '100%' });
            });

            clearInterval(ini_val);
                  
        }, 100);
    });

    $repeaterForm.on('click', '.form-repeater-remove', function(event) {
        repeaterRemove($(this), event);
    });
    // BEN 08.02 END
});