import { createPortal } from "react-dom";
import styles from './Loader.module.scss'
function LoaderComponent({loading}) {
    return (
        <div className={loading?styles.Loader:styles['Loader-Blank']}>
        </div>
    )
}

function Loader(props) {
    return createPortal(
        <LoaderComponent {...props}/>,
        document.getElementById("loader")
    )
}
export default Loader;