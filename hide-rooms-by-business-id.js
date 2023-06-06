const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

// Passed business id in iframe for example
const CLINIC_ID = urlParams.get('businessId')

// Action to avoid initial state view
document.getElementById('react-root').style.visibility = 'hidden'

// Entire DOM interface is rendered in some time after custom script is run so we need postpone main DOM processing
setTimeout(() => {
    console.log('start')
    document.getElementById('react-root').style.visibility = 'visible'

    const sidebar = document.getElementById('sidebar-region')

    if (!CLINIC_ID) {
        return false
    }

    const handleBusinessId = () => {
        document.querySelectorAll('.rcx-sidebar-item').forEach(el => {
            const titleEl = el.querySelector('.rcx-sidebar-item__title')
            if (!titleEl.textContent.endsWith(CLINIC_ID) && titleEl.getAttribute('business_id') !== CLINIC_ID) {
                el.style.visibility = 'hidden'
                // Inner virtual list lib has conflict if we hide element entirely
                el.style.height = '1px'
                el.style.padding = '0px'
            } else {
                titleEl.setAttribute('business_id', CLINIC_ID)
                titleEl.textContent = titleEl.textContent.replace('_' + CLINIC_ID, '')
            }
        })
    }

    handleBusinessId()

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            let oldValue = mutation.oldValue;
            let newValue = mutation.target.textContent;
            if (oldValue !== newValue) {
                console.log('mutation')
                handleBusinessId()
            }
        });
    });

    // Such config causes much processing calls so that may overload with heavy state updates
    observer.observe(sidebar, {
        characterDataOldValue: true,
        subtree: true,
        childList: true,
        characterData: true
    });
}, 1000)
