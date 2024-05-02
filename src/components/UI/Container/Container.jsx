import styles from "./Container.module.css";
export const Container = ({ children }) => {
  return <section className={styles.container}>{children}</section>;
};
