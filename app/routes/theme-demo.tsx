import { ThemeSwitcher } from "~/components/theme-switcher";

export default function ThemeDemo() {
  return (
    <div className="theme-padding-xl">
      <div className="nes-container with-title">
        <p className="title">Theme System Demo</p>
        <div className="theme-spacing-md">
          <ThemeSwitcher />
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-container">
          <h2>Typography</h2>
          <p>This is a paragraph demonstrating the theme system. The font and styling will change based on the selected theme.</p>
          <p className="theme-spacing-md">
            <small>This is small text</small>
          </p>
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-container">
          <h2>Buttons</h2>
          <div className="theme-spacing-md">
            <button className="nes-btn">Default</button>
            <button className="nes-btn is-primary">Primary</button>
            <button className="nes-btn is-success">Success</button>
            <button className="nes-btn is-warning">Warning</button>
            <button className="nes-btn is-error">Error</button>
            <button className="nes-btn is-disabled">Disabled</button>
          </div>
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-container">
          <h2>Form Elements</h2>
          <div className="theme-spacing-md">
            <div className="nes-field">
              <label htmlFor="name_field">Name</label>
              <input type="text" id="name_field" className="nes-input" placeholder="Enter your name" />
            </div>
            
            <div className="nes-field theme-spacing-md">
              <label htmlFor="message_field">Message</label>
              <textarea id="message_field" className="nes-textarea" placeholder="Enter your message"></textarea>
            </div>

            <div className="nes-field theme-spacing-md">
              <label htmlFor="theme_select">Select Option</label>
              <div className="nes-select">
                <select id="theme_select">
                  <option value="">Select...</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-container">
          <h2>Progress Bars</h2>
          <div className="theme-spacing-md">
            <progress className="nes-progress" value="70" max="100"></progress>
            <progress className="nes-progress is-primary" value="80" max="100"></progress>
            <progress className="nes-progress is-success" value="90" max="100"></progress>
            <progress className="nes-progress is-warning" value="60" max="100"></progress>
            <progress className="nes-progress is-error" value="50" max="100"></progress>
          </div>
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-container is-dark">
          <p>Dark Container</p>
          <p>This container has a dark theme variant.</p>
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-container is-rounded">
          <p>Rounded Container</p>
          <p>This container has rounded corners in professional theme and pixelated corners in NES theme.</p>
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-balloon from-left">
          <p>This is a speech balloon!</p>
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-container">
          <h2>Lists</h2>
          <ul className="nes-list is-disc">
            <li>First item</li>
            <li>Second item</li>
            <li>Third item</li>
          </ul>
          
          <ul className="nes-list is-circle theme-spacing-md">
            <li>Circle item 1</li>
            <li>Circle item 2</li>
            <li>Circle item 3</li>
          </ul>
        </div>
      </div>

      <div className="theme-spacing-lg">
        <div className="nes-container">
          <h2>Table</h2>
          <div className="nes-table-responsive">
            <table className="nes-table is-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Score</th>
                  <th>Level</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Player 1</td>
                  <td>9999</td>
                  <td>10</td>
                </tr>
                <tr>
                  <td>Player 2</td>
                  <td>8888</td>
                  <td>9</td>
                </tr>
                <tr>
                  <td>Player 3</td>
                  <td>7777</td>
                  <td>8</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}