// @ts-nocheck
// eslint-disable

export default function Footer() {
    function handleConsentLinkClick() {
        if (window.__lxG__consent__ !== undefined && window.__lxG__consent__.getState() !== null) {
            window.__lxG__consent__.showConsent()
        } else {
            alert('This function only for users from European Economic Area (EEA)')
        }
        return false
    }
    return (
        <div className="flex bg-white dark:bg-slate-900 text-slate-600 p-3 items-center justify-between text-xs tracking-wide border-t-1 z-50">
            <div>
                © 2024 Created by{' '}
                <a href="https://danfolio.vercel.app" target="_blank" className="ml-1 font-semibold text-slate-600">
                    @dnm17_
                </a>
            </div>
            <div>
                <a href="#" onClick={handleConsentLinkClick}>
                    Change privacy settings
                </a>
            </div>
        </div>
    )
}
