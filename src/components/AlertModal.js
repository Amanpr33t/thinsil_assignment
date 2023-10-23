
import { Fragment } from "react"

function AlertModal(props) {
    const { message, type, alertModalRemover } = props

    return (
        <Fragment>
            <div className="fixed z-50 top-16 pt-12 bg-transparent h-screen w-full flex justify-center " onClick={alertModalRemover}>
                <div className="relative w-11/12 sm:w-96 h-fit rounded-lg shadow bg-white" onClick={e => e.stopPropagation()}>
                    <button type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 " onClick={alertModalRemover}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                        {type === 'warning' && <svg className="mx-auto mb-4 text-red-500 w-12 h-12 " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>}
                        {type === 'success' && <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="mx-auto mb-4 text-green-700 w-12 h-12" viewBox="0 0 16 16">
                            <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                        </svg>}
                        <h3 className="mb-5 text-lg font-normal text-gray-700 ">{message}</h3>
                        <button data-modal-hide="popup-modal" type="button" className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600" onClick={alertModalRemover}>{type === 'warning' ? 'Cancel' : 'Ok'}</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}
export default AlertModal