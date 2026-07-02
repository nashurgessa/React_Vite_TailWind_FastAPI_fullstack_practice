class User {
    id: string;
    displayedName?: string; // Optional property
    private _email?: string; // Private property with getter and setter
    name!: string;  // Public property with definite assignment assertion
    
    #attributes: Map<string, any>;  // Private field
    
    static #userCount: number = 0; // Static property to count users

    roles = ["admin", "user"]; // Public field with default value
    readonly createdAt = new Date(); // Readonly field with a default value;

    constructor(id: string, name: string) {
        this.id = id;
        this.name = name;
    }
    greet(): string {
        return `Hello, my name is ${this.name} and my ID is ${this.id}.`;
    }   

    private get email(): string | undefined {
        return this._email;
    }
    private set email(value: string | undefined) {
        if (value && !this.validateEmail(value)) {
            throw new Error("Invalid email format");
        }
        this._email = value;
    }

    protected validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    addAttribute(key: string, value: any): void {
        if (!this.#attributes) {
            this.#attributes = new Map();
        }
        this.#attributes.set(key, value);
    }

    static {this.#userCount++;} // Static initializer to increment user count
    static getUserCount(): number {
        return this.#userCount; 
    }

}