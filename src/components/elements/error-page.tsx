import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
    const error: any = useRouteError()

    if (import.meta.env.DEV) console.log(error)

    return (
        <div id="error-page" className="flex flex-col items-center gap-5">
            <h1 className="text-2xl font-bold">Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i className="text-red-400">{error.statusText || error.message}</i>
            </p>
        </div>
    )
}
