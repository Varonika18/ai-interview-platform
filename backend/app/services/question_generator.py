questions_db = {

"python":[
"What is Python GIL?",
"What are decorators?"
],

"docker":[
"What is Docker container?",
"Docker vs Virtual Machine?"
],

"machine learning":[
"What is overfitting?",
"What is supervised learning?"
]

}

def generate_questions(skills):

    questions = []

    for skill in skills:
        if skill in questions_db:
            questions.extend(questions_db[skill])

    return questions