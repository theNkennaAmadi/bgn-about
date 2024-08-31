import gsap from 'gsap';

// Create a matchMedia instance
const mm = gsap.matchMedia();

// Define a context for the min-width of 768px
mm.add("(min-width: 768px)", () => {
    const leadersItems = document.querySelectorAll('.leaders-cc-item');
    let activeIndex = null; // Keep track of the currently active (open) item index
    let isAnimating = false; // Flag to prevent multiple animations at once

    leadersItems.forEach((item, index) => {
        const tl = gsap.timeline({ paused: true });
        tl.set(item, { zIndex: 10, ease: 'power2' })
            .to(item, { width: 'auto', duration: 1.5, ease: 'power2.out' });

        if (index !== 1) {
            tl.to(leadersItems[1], {
                x: () => index === 0 ? "90%" : '-90%',
                zIndex: 9,
                duration: 1.5,
                ease: 'power2.out'
            }, "<");
        }

        // Attach the timeline to the item so we can reference it later
        item.timeline = tl;

        // Add event listener for opening the item on "leaders-left" click
        const openTrigger = item.querySelector('.leaders-left');
        openTrigger.addEventListener('click', () => {
            if (isAnimating) return; // Prevent any action if an animation is ongoing
            isAnimating = true; // Set the animation flag to true

            // If there's an active item and it's not the currently clicked item
            if (activeIndex !== null && activeIndex !== index) {
                // Close the currently open item first
                leadersItems[activeIndex].timeline.reverse().then(() => {
                    // Once the active item is closed, play the new item animation
                    tl.play().then(() => {
                        isAnimating = false; // Reset animation flag after the new item opens
                    });
                });
                // Update activeIndex to the newly clicked item
                activeIndex = index;
            } else if (activeIndex === index) {
                // If the same item is clicked again, do nothing since it's already open
                isAnimating = false; // Reset animation flag immediately
            } else {
                // If no item is active, just open the clicked item
                tl.play().then(() => {
                    isAnimating = false; // Reset animation flag after it opens
                    activeIndex = index; // Update activeIndex to the newly clicked item
                });
            }
        });

        // Add event listener for closing the item on "leader-right-cta-dn" click
        const closeTrigger = item.querySelector('.leader-right-cta-dn');
        closeTrigger.addEventListener('click', () => {
            if (isAnimating) return; // Prevent any action if an animation is ongoing
            isAnimating = true; // Set the animation flag to true

            // Only close the item if it is currently active
            if (activeIndex === index) {
                tl.reverse().then(() => {
                    isAnimating = false; // Reset animation flag after it closes
                    activeIndex = null;  // Reset activeIndex
                });
            } else {
                isAnimating = false; // Reset animation flag immediately if clicked item is not active
            }
        });
    });
});
