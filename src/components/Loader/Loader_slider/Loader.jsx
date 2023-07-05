import styles from './Loader.module.scss'
function Loader({loading}) {
    return (
        <div className={loading?styles.Loader:styles['Loader-Blank']}>
        </div>
    )
}

export default Loader;