export class ProgramError extends Error {
    constructor(title: string, public critic = false) {
        super(title); 
        this.critic = critic; 
    }
}
