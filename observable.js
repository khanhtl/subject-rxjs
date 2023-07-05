var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * @description Khi có một observer subcribe, observer sẽ nhận được giá trị emit tiếp theo của subject
 * @author tlkhanh 05.07.2023
 */
var Subject = /** @class */ (function () {
    function Subject() {
        this.state = [];
        this.completed = false;
        this.observers = new Set();
    }
    /**
     * Kiểm tra trạng thái subject đã completed hay chưa
     * Nếu đã completed thì sẽ show error
     * @author tlkhanh 05.07.2023
     * @returns
     */
    Subject.prototype.checkCompleted = function () {
        if (this.completed) {
            throw new Error('');
        }
        return;
    };
    /**
     * subject emit giá trị cho tất cả các observer
     * @author tlkhanh 05.07.2023
     * @param data
     */
    Subject.prototype.next = function (data) {
        var _this = this;
        this.checkCompleted();
        this.state.push(data);
        this.observers.forEach(function (observer) {
            observer(_this.state[_this.state.length - 1]);
        });
    };
    /**
     * observer theo dõi subject
     * @author tlkhanh 05.07.2023
     * @param observer
     * @returns
     */
    Subject.prototype.subcribe = function (observer) {
        var _this = this;
        this.checkCompleted();
        this.observers.add(observer);
        return {
            unsubscribe: function () {
                _this.observers.delete(observer);
            }
        };
    };
    /**
     * Hoàn thành observable
     * @author tlkhanh 05.07.2023
     * @param callback
     */
    Subject.prototype.complete = function (callback) {
        this.completed = true;
        this.observers = new Set();
        typeof callback === 'function' && (callback());
    };
    return Subject;
}());
/**
 * @description Khi có một observer subcribe, observer sẽ nhận được giá trị emit tiếp theo của subject
 * @author tlkhanh 05.07.2023
 */
var BehaviorSubject = /** @class */ (function (_super) {
    __extends(BehaviorSubject, _super);
    function BehaviorSubject(initState) {
        var _this = _super.call(this) || this;
        _this.state.push(initState);
        return _this;
    }
    BehaviorSubject.prototype.subcribe = function (observer) {
        _super.prototype.checkCompleted.call(this);
        observer(this.state[this.state.length - 1]);
        return _super.prototype.subcribe.call(this, observer);
    };
    return BehaviorSubject;
}(Subject));
/**
 * @description Khi có một observer subcribe, observerble sẽ phát lại toàn bộ giá trị của subject cho observer
 * @author tlkhanh 05.07.2023
 */
var ReplaySubject = /** @class */ (function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReplaySubject.prototype.subcribe = function (observer) {
        _super.prototype.checkCompleted.call(this);
        this.state.forEach(function (state) {
            observer(state);
        });
        return _super.prototype.subcribe.call(this, observer);
    };
    return ReplaySubject;
}(Subject));
/**
 * @description Khi có một observer subcribe, observer sẽ nhân được giá trị cuối cùng trước khi completed
 * @author tlkhanh 05.07.2023
 */
var AsyncSubject = /** @class */ (function (_super) {
    __extends(AsyncSubject, _super);
    function AsyncSubject() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AsyncSubject.prototype.next = function (data) {
        this.checkCompleted();
        this.state.push(data);
    };
    AsyncSubject.prototype.complete = function (callback) {
        var _this = this;
        this.observers.forEach(function (observer) {
            observer(_this.state[_this.state.length - 1]);
        });
        _super.prototype.complete.call(this, callback);
    };
    return AsyncSubject;
}(Subject));
// Demo
// Subject
// const subject$ = new Subject();
// subject$.next(1);
// subject$.subcribe((data) => {
//     console.log(`Observer 1 receive `, data);
// });
// subject$.subcribe((data) => {
//     console.log(`Observer 2 receive `, data);
// });
// subject$.next(2);
// subject$.next(3);
// subject$.next(4);
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
