const Footer = () => {
  return (
    <footer style={{ textAlign: "center", padding: "1em", background: "#f8f9fa" }}>
      <p>Created with React</p>
      <div style={{ marginTop: "0.5em" }}>
        <a
          href="https://github.com/bradenweii"
          target="_blank"
          rel="noopener noreferrer"
          style={{ margin: "0 0.5em", color: "inherit" }}
        >
          <i className="fab fa-github" style={{ fontSize: "1.2em" }}></i>
        </a>
        </div>
    </footer>
  );
};

export default Footer;
