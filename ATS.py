"""
ATS Resume Scanner - Streamlit Deployment
This app serves the ATS Resume Scanner web application through Streamlit
"""

import streamlit as st
import streamlit.components.v1 as components
import os

# Set page configuration
st.set_page_config(
    page_title="ATS Resume Scanner Pro",
    page_icon="📄",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit default elements for a cleaner look
hide_streamlit_style = """
<style>
#MainMenu {visibility: hidden;}
footer {visibility: hidden;}
header {visibility: hidden;}
.block-container {
    padding-top: 0rem;
    padding-bottom: 0rem;
    padding-left: 0rem;
    padding-right: 0rem;
}
</style>
"""
st.markdown(hide_streamlit_style, unsafe_allow_html=True)

# Read the HTML file
def read_file(filename):
    """Read and return file contents"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        st.error(f"File {filename} not found. Please ensure all files are in the same directory.")
        return None

# Read all three files
html_content = read_file('index.html')
css_content = read_file('style.css')
js_content = read_file('app.js')

if html_content and css_content and js_content:
    # Inject CSS and JS into HTML
    # Find the closing </head> tag and insert CSS before it
    if '</head>' in html_content:
        css_injection = f"<style>{css_content}</style>"
        html_content = html_content.replace('</head>', f'{css_injection}</head>')
    
    # Find the closing </body> tag and insert JS before it
    if '</body>' in html_content:
        js_injection = f"<script>{js_content}</script>"
        html_content = html_content.replace('</body>', f'{js_injection}</body>')
    
    # Render the complete HTML page
    components.html(html_content, height=800, scrolling=True)
    
    # Add information in sidebar
    with st.sidebar:
        st.title("📄 ATS Resume Scanner Pro")
        st.markdown("---")
        st.markdown("""
        ### About
        This application helps you optimize your resume for Applicant Tracking Systems (ATS).
        
        ### Features
        - ✅ Real-time ATS score calculation
        - ✅ Keyword matching analysis
        - ✅ Skills relevance checking
        - ✅ Experience evaluation
        - ✅ Formatting assessment
        - ✅ Optimization suggestions
        
        ### How to Use
        1. Paste your resume text in the first field
        2. Paste the job description in the second field
        3. Click "Analyze My Resume Now"
        4. Review your ATS score and suggestions
        
        ### Tips
        - Ensure both fields have at least 100 characters
        - Copy complete text from your resume
        - Include all sections (Experience, Skills, Education)
        - Use the example data to test the app
        
        ---
        
        **Made with ❤️ for Job Seekers**
        """)
else:
    st.error("⚠️ Unable to load the application. Please ensure index.html, style.css, and app.js are in the same directory as this Python file.")
    
    st.markdown("""
    ### Required Files:
    - `index.html` - Main HTML structure
    - `style.css` - Styling and themes
    - `app.js` - Application logic
    - `app.py` - This Streamlit file
    
    ### File Structure:
    ```
    your-project-folder/
    ├── app.py (this file)
    ├── index.html
    ├── style.css
    └── app.js
    ```
    
    ### To Deploy:
    1. Place all 4 files in the same directory
    2. Run: `streamlit run app.py`
    3. Or deploy to Streamlit Cloud
    """)
