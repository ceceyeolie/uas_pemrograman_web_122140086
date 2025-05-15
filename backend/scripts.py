import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT = os.path.join(BASE_DIR, "context.md")


def extract_file_summary(file_path, title):
    try:
        with open(file_path, encoding='utf-8') as f:
            lines = f.readlines()

        content = "".join(lines).strip()
        summary = f"\n\n## {title}\n**Path**: `{file_path}`\n\n```python\n{content}\n```\n"
        return summary

    except Exception as e:
        return f"\n\n## {title}\n**Path**: `{file_path}`\n\nError reading file: {e}"


def main():
    sections = []

    # development.ini
    ini_path = os.path.join(BASE_DIR, 'development.ini')
    if os.path.exists(ini_path):
        with open(ini_path, encoding='utf-8') as f:
            ini_content = f.read()
        sections.append(f"## development.ini\n\n```ini\n{ini_content}\n```")

    # script initialize_db.py
    init_script = os.path.join(BASE_DIR, 'backend', 'scripts', 'initialize_db.py')
    sections.append(extract_file_summary(init_script, 'initialize_db.py'))

    # models
    model_dir = os.path.join(BASE_DIR, 'backend', 'models')
    for fname in ['__init__.py', 'meta.py', 'mymodel.py', 'recipe.py']:
        fpath = os.path.join(model_dir, fname)
        if os.path.exists(fpath):
            sections.append(extract_file_summary(fpath, f'models/{fname}'))

    # views
    views_dir = os.path.join(BASE_DIR, 'backend', 'views')
    if os.path.isdir(views_dir):
        for fname in os.listdir(views_dir):
            if fname.endswith('.py'):
                sections.append(extract_file_summary(os.path.join(views_dir, fname), f'views/{fname}'))

    # __init__.py root
    sections.append(extract_file_summary(os.path.join(BASE_DIR, 'backend', '__init__.py'), 'backend/__init__.py'))

    # routes.py
    routes_py = os.path.join(BASE_DIR, 'backend', 'routes.py')
    if os.path.exists(routes_py):
        sections.append(extract_file_summary(routes_py, 'routes.py'))

    # write all to context.md
    with open(OUTPUT, "w", encoding="utf-8") as out:
        out.write("# Project Context Summary\n\n" + "\n".join(sections))

    print(f"[✓] context.md berhasil dibuat di: {OUTPUT}")


if __name__ == "__main__":
    main()
