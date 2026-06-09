questions_db = {

    "python": {
        "easy": [
            "What is Python? What are its key features?",
            "What is the difference between a list and a tuple?",
            "What is a dictionary in Python?",
            "What are Python data types?",
            "What is the difference between '==' and 'is' in Python?",
        ],
        "medium": [
            "What is Python GIL and why does it matter?",
            "What are decorators in Python? Give an example.",
            "What is the difference between deep copy and shallow copy?",
            "Explain list comprehension with an example.",
            "What are *args and **kwargs in Python?",
        ],
        "hard": [
            "Explain Python's memory management and garbage collection.",
            "What are metaclasses in Python?",
            "Explain the difference between multiprocessing and multithreading in Python.",
            "What is a context manager and how do you create one?",
            "Explain Python's MRO (Method Resolution Order).",
        ]
    },

    "java": {
        "easy": [
            "What is the difference between JDK, JRE, and JVM?",
            "What are the primitive data types in Java?",
            "What is the difference between == and .equals() in Java?",
            "What is a constructor in Java?",
            "What is the difference between String, StringBuilder, and StringBuffer?",
        ],
        "medium": [
            "What is the difference between abstract class and interface in Java?",
            "Explain exception handling in Java with try, catch, finally.",
            "What is method overloading and method overriding?",
            "What are generics in Java?",
            "What is the Collections framework in Java?",
        ],
        "hard": [
            "Explain Java memory model and how garbage collection works.",
            "What are Java streams and how do they work?",
            "Explain the SOLID principles with Java examples.",
            "What is the difference between Callable and Runnable?",
            "Explain Java concurrency utilities (ExecutorService, Future, etc.).",
        ]
    },

    "c": {
        "easy": [
            "What is a pointer in C?",
            "What is the difference between malloc() and calloc()?",
            "What is a structure in C?",
            "What is the difference between local and global variables?",
            "What is a null pointer?",
        ],
        "medium": [
            "What is the difference between pass by value and pass by reference in C?",
            "Explain dynamic memory allocation in C.",
            "What are function pointers in C?",
            "What is the difference between struct and union?",
            "What is a dangling pointer?",
        ],
        "hard": [
            "Explain memory layout of a C program (stack, heap, BSS, data, text segments).",
            "What is volatile keyword in C and when to use it?",
            "Explain how linked list is implemented in C.",
            "What are bit fields in C?",
            "What is the difference between #define and const in C?",
        ]
    },

    "cpp": {
        "easy": [
            "What is the difference between C and C++?",
            "What is a class in C++?",
            "What is the difference between struct and class in C++?",
            "What is a constructor and destructor?",
            "What is function overloading in C++?",
        ],
        "medium": [
            "What is polymorphism in C++? Explain with example.",
            "What is a virtual function in C++?",
            "What is the difference between new/delete and malloc/free?",
            "What are templates in C++?",
            "What is operator overloading?",
        ],
        "hard": [
            "What is the Rule of Three/Five in C++?",
            "Explain move semantics and rvalue references in C++11.",
            "What is RAII and how does it work?",
            "What are smart pointers (unique_ptr, shared_ptr, weak_ptr)?",
            "Explain virtual dispatch and vtable mechanism.",
        ]
    },

    "oops": {
        "easy": [
            "What are the four pillars of OOP?",
            "What is the difference between a class and an object?",
            "What is encapsulation?",
            "What is inheritance and what are its types?",
            "What is the difference between method overloading and overriding?",
        ],
        "medium": [
            "What is polymorphism? Explain runtime vs compile-time polymorphism.",
            "What is abstraction and how is it achieved?",
            "What is an interface and how is it different from an abstract class?",
            "What is multiple inheritance and what problems does it cause?",
            "What is the difference between composition and inheritance?",
        ],
        "hard": [
            "Explain SOLID principles in detail with examples.",
            "What is the diamond problem and how is it solved?",
            "What are design patterns? Explain Singleton and Factory pattern.",
            "What is dependency injection?",
            "Explain the Open/Closed Principle with a real-world example.",
        ]
    },

    "os": {
        "easy": [
            "What is an operating system and what are its functions?",
            "What is the difference between a process and a thread?",
            "What is context switching?",
            "What is a deadlock?",
            "What is virtual memory?",
        ],
        "medium": [
            "What are the conditions for deadlock? How can it be prevented?",
            "Explain process scheduling algorithms (FCFS, SJF, Round Robin).",
            "What is the difference between paging and segmentation?",
            "What is thrashing in operating systems?",
            "What are semaphores and mutexes?",
        ],
        "hard": [
            "Explain the banker's algorithm for deadlock avoidance.",
            "What is the difference between internal and external fragmentation?",
            "Explain page replacement algorithms (LRU, FIFO, Optimal).",
            "What is inter-process communication (IPC)? Explain its mechanisms.",
            "Explain the concept of spinlock vs mutex.",
        ]
    },

    "cn": {
        "easy": [
            "What is the OSI model? Name all 7 layers.",
            "What is the difference between TCP and UDP?",
            "What is an IP address?",
            "What is DNS and how does it work?",
            "What is the difference between HTTP and HTTPS?",
        ],
        "medium": [
            "What is the TCP three-way handshake?",
            "What is the difference between IPv4 and IPv6?",
            "What is subnetting and CIDR notation?",
            "What is a firewall and how does it work?",
            "Explain the difference between routing and switching.",
        ],
        "hard": [
            "Explain TCP congestion control mechanisms.",
            "What is BGP and how does it work?",
            "Explain SSL/TLS handshake in detail.",
            "What is NAT and why is it used?",
            "Explain the difference between distance vector and link state routing.",
        ]
    },

    "dbms": {
        "easy": [
            "What is a database and what is DBMS?",
            "What is the difference between SQL and NoSQL?",
            "What are primary key and foreign key?",
            "What is normalization?",
            "What is the difference between DELETE, TRUNCATE, and DROP?",
        ],
        "medium": [
            "What are the ACID properties in a database?",
            "Explain the different normal forms (1NF, 2NF, 3NF, BCNF).",
            "What is an index and how does it improve performance?",
            "What is a JOIN? Explain types of JOINs.",
            "What is a transaction and how is it managed?",
        ],
        "hard": [
            "What is the difference between clustered and non-clustered index?",
            "Explain deadlock in databases and how to handle it.",
            "What is query optimization? How does a query planner work?",
            "Explain the CAP theorem.",
            "What is database sharding and when should you use it?",
        ]
    },

    "sql": {
        "easy": [
            "What is the difference between WHERE and HAVING clause?",
            "What is the difference between UNION and UNION ALL?",
            "What are aggregate functions in SQL?",
            "What is a VIEW in SQL?",
            "What is the difference between CHAR and VARCHAR?",
        ],
        "medium": [
            "Write a query to find the second highest salary from an employee table.",
            "What are window functions in SQL? Give an example.",
            "What is a stored procedure and how is it different from a function?",
            "Explain different types of JOINs with examples.",
            "What are triggers in SQL?",
        ],
        "hard": [
            "Explain query execution plan and how to optimize slow queries.",
            "What is the difference between correlated and non-correlated subqueries?",
            "Explain partitioning in SQL databases.",
            "Write a query to find duplicate records and delete them keeping one.",
            "What are CTEs (Common Table Expressions) and recursive CTEs?",
        ]
    },

    "mix": {
        "easy": [
            "What is the difference between a stack and a queue?",
            "What is recursion? Give an example.",
            "What is the difference between compiled and interpreted languages?",
            "What is an API?",
            "What is the difference between synchronous and asynchronous programming?",
        ],
        "medium": [
            "What is the difference between REST and GraphQL?",
            "Explain time complexity and Big-O notation.",
            "What is the difference between SQL and NoSQL databases?",
            "What is a hash table and how does it work?",
            "What is the difference between authentication and authorization?",
        ],
        "hard": [
            "Explain the CAP theorem and its implications.",
            "What is consistent hashing and where is it used?",
            "Design a URL shortener system.",
            "Explain the differences between monolithic and microservices architecture.",
            "What is eventual consistency?",
        ]
    }
}


def generate_questions(subject, difficulty):
    subject = subject.lower()
    difficulty = difficulty.lower()
    if subject not in questions_db:
        return []
    if difficulty not in questions_db[subject]:
        return []
    return questions_db[subject][difficulty]
