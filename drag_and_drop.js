function dragAndDrop($el, $to, options) {
    options = options || {};
    var position = options.position || 'center';
    var elementCenter = $el.offset();
    var toOffset = $to.offset();

    if (_.isObject(position)) {
        toOffset.top += position.top;
        toOffset.left += position.left;
    } else {
        toOffset.top += $to.outerHeight() / 2;
        toOffset.left += $to.outerWidth() / 2;
        var vertical_offset = (toOffset.top < elementCenter.top) ? -1 : 1;
        if (position === 'top') {
            toOffset.top -= $to.outerHeight() / 2 + vertical_offset;
        } else if (position === 'bottom') {
            toOffset.top += $to.outerHeight() / 2 - vertical_offset;
        } else if (position === 'left') {
            toOffset.left -= $to.outerWidth() / 2;
        } else if (position === 'right') {
            toOffset.left += $to.outerWidth() / 2;
        }
    }

    if ($to[0].ownerDocument !== document) {
        // we are in an iframe
        var bound = $('iframe')[0].getBoundingClientRect();
        toOffset.left += bound.left;
        toOffset.top += bound.top;
    }
    $el.trigger($.Event("mouseenter"));
    if (!(options.continueMove)) {
        elementCenter.left += $el.outerWidth() / 2;
        elementCenter.top += $el.outerHeight() / 2;

        $el.trigger($.Event("mousedown", {
            which: 1,
            pageX: elementCenter.left,
            pageY: elementCenter.top
        }));
    }

    $el.trigger($.Event("mousemove", {
        which: 1,
        pageX: toOffset.left,
        pageY: toOffset.top
    }));

    if (!options.disableDrop) {
        $el.trigger($.Event("mouseup", {
            which: 1,
            pageX: toOffset.left,
            pageY: toOffset.top
        }));
        if (options.withTrailingClick) {
            $el.click();
        }
    } else {
        // It's impossible to drag another element when one is already
        // being dragged. So it's necessary to finish the drop when the test is
        // over otherwise it's impossible for the next tests to drag and
        // drop elements.
        $el.on("remove", function () {
            $el.trigger($.Event("mouseup"));
        });
    }
  }
