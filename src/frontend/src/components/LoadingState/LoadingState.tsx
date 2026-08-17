import styles from './LoadingState.module.css';

type LoadingStateProps = {
  text?: string;
};

function LoadingState({ text = 'Загрузка...' }: LoadingStateProps) {
  return (
    <div className={styles.container} role="status">
      <span className={styles.spinner} />
      <span>{text}</span>
    </div>
  );
}

export default LoadingState;