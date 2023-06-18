import "./menu.css";

const Menu = () => {
  return (
    <div className="menu-bar">
      <h2>Add Shapes</h2>
      <div className="shapes">
        <button>Circle</button>
        <button>Rectangle</button>
        <button>Triangle</button>
      </div>
      <h2>Images</h2>
    </div>
  );
};

export default Menu;
