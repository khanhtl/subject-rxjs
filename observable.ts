/**
 * @description Khi có một observer subcribe, observer sẽ nhận được giá trị emit tiếp theo của subject
 * @author tlkhanh 05.07.2023
 */
class Subject {
    state: any[] = [];
    completed = false;
    observers = new Set<Function>();
    /**
     * Kiểm tra trạng thái subject đã completed hay chưa
     * Nếu đã completed thì sẽ show error
     * @author tlkhanh 05.07.2023
     * @returns 
     */
    checkCompleted() {
        if(this.completed) {
            throw new Error('')
        }
        return;
    }
    /**
     * subject emit giá trị cho tất cả các observer
     * @author tlkhanh 05.07.2023
     * @param data 
     */
    next(data: any) {
        this.checkCompleted();
        this.state.push(data);
        this.observers.forEach(observer => {
            observer(this.state[this.state.length - 1]);
        });
    }
    /**
     * observer theo dõi subject
     * @author tlkhanh 05.07.2023
     * @param observer 
     * @returns 
     */
    subcribe(observer: Function): { unsubscribe: Function } {
        this.checkCompleted();
        this.observers.add(observer);
        return {
            unsubscribe: () => {
              this.observers.delete(observer);
            }
        };
    }
    /**
     * Hoàn thành observable
     * @author tlkhanh 05.07.2023
     * @param callback 
     */
    complete(callback?: Function) {
        this.completed = true;
        this.observers = new Set<Function>();
        typeof callback === 'function' && (callback());
    }

}
/**
 * @description Khi có một observer subcribe, observer sẽ nhận được giá trị emit trước đó của subject
 * @author tlkhanh 05.07.2023
 */
class BehaviorSubject<T> extends Subject{
    constructor(initState: T) {
        super();
        this.state.push(initState)
    }
    subcribe(observer: Function) {
        super.checkCompleted();
        observer(this.state[this.state.length - 1]);
        return super.subcribe(observer);
    }
}
/**
 * @description Khi có một observer subcribe, observerble sẽ phát lại toàn bộ giá trị của subject cho observer
 * @author tlkhanh 05.07.2023
 */
class ReplaySubject<T> extends Subject {
    subcribe(observer: Function) {
        super.checkCompleted();
        this.state.forEach(state => {
            observer(state)
        });
        return super.subcribe(observer);
    }
}
/**
 * @description Khi có một observer subcribe, observer sẽ nhân được giá trị cuối cùng trước khi completed
 * @author tlkhanh 05.07.2023
 */
class AsyncSubject extends Subject {
    next(data: any) {
        this.checkCompleted();
        this.state.push(data);
    }
    complete(callback?: Function) {
        this.observers.forEach(observer => {
            observer(this.state[this.state.length - 1])
        });
        super.complete(callback);
    }
}

// Demo

// Subject
const subject$ = new Subject();
const observer1 = 
subject$.next(1);
let sub1 = subject$.subcribe((data) => {
    console.log(`Observer 1 receive `, data);
    
});
subject$.subcribe((data) => {
    console.log(`Observer 2 receive `, data);
    
});
subject$.next(2);
subject$.next(3);
sub1.unsubscribe();
subject$.next(4);

// Behavior Subject
// const behaviorSubject$ = new BehaviorSubject(1);
// behaviorSubject$.subcribe((data) => {
//     console.log(`Observer 1 receive `, data);
    
// });
// behaviorSubject$.next(2);
// behaviorSubject$.subcribe((data) => {
//     console.log(`Observer 2 receive `, data);
    
// });
// behaviorSubject$.next(3);
// behaviorSubject$.next(4);

// Replay Subject

// const replaySubject$ = new ReplaySubject();
// replaySubject$.next(1);
// replaySubject$.next(2);
// replaySubject$.subcribe((data) => {
//     console.log(`Observer 1 receive `, data);
    
// });
// replaySubject$.next(3);
// replaySubject$.next(4);
// replaySubject$.subcribe((data) => {
//     console.log(`Observer 2 receive `, data);
    
// });

// Async subject
// const asyncSubject$ = new AsyncSubject();
// asyncSubject$.next(1);
// asyncSubject$.next(2);
// asyncSubject$.subcribe((data) => {
//     console.log(`Observer 1 receive `, data);
// });
// asyncSubject$.next(3);
// asyncSubject$.subcribe((data) => {
//     console.log(`Observer 2 receive `, data);
// });
// asyncSubject$.complete();
// asyncSubject$.next(4);


