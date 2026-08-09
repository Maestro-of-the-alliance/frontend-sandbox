import re, sys, html

def extract_text(filepath):
    with open(filepath, encoding='utf-8') as f:
        content = f.read()
    # Strip <style> and <script> blocks entirely
    content = re.sub(r'<style[^>]*>.*?</style>', '', content, flags=re.DOTALL)
    content = re.sub(r'<script[^>]*>.*?</script>', '', content, flags=re.DOTALL)
    # Add newlines around block-level tags to preserve structure
    for tag in ['div','p','h1','h2','h3','li','ul','header','section','article','br']:
        content = re.sub(rf'</{tag}>', f'\n', content, flags=re.IGNORECASE)
        content = re.sub(rf'<{tag}[^>]*>', f'\n', content, flags=re.IGNORECASE)
    # Strip remaining tags
    content = re.sub(r'<[^>]+>', '', content)
    content = html.unescape(content)
    # Collapse whitespace
    lines = [l.strip() for l in content.split('\n')]
    lines = [l for l in lines if l]
    return '\n'.join(lines)

if __name__ == '__main__':
    print(extract_text(sys.argv[1]))
