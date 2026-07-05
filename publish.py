import json
import os
import re
from datetime import datetime
import sys

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def publish(draft_path):
    with open(draft_path, 'r', encoding='utf-8') as f:
        draft = json.load(f)
    
    title = draft.get('title', 'Untitled')
    slug = draft.get('slug') or slugify(title)
    
    post = {
        'title': title,
        'slug': slug,
        'date': datetime.utcnow().isoformat() + 'Z',
        'excerpt': draft.get('excerpt', ''),
        'content': draft.get('content', '')
    }
    
    out_dir = os.path.join('src', 'data', 'alpha')
    os.makedirs(out_dir, exist_ok=True)
    
    out_path = os.path.join(out_dir, f"{slug}.json")
    with open(out_path, 'w', encoding='utf-8') as f:
        json.dump(post, f, indent=2)
        
    print(f"[+] Successfully published ALPHA payload to {out_path}")

if __name__ == "__main__":
    draft_file = sys.argv[1] if len(sys.argv) > 1 else 'draft.json'
    if not os.path.exists(draft_file):
        print(f"Error: Draft file '{draft_file}' not found.")
        sys.exit(1)
    publish(draft_file)
