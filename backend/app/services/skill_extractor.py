skills_db = [
"python",
"java",
"machine learning",
"docker",
"kubernetes",
"react"
]

def extract_skills(text):

    found = []

    for skill in skills_db:
        if skill.lower() in text.lower():
            found.append(skill)

    return found