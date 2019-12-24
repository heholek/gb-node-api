import "roslib";
import { BehaviorSubject, Observable, Subject } from "rxjs";

/**
 * GB Data Stream class. Streams all data from ROS.
 * Access data `GbDataStream.topic('key').subscribe(v => {console.log(v)};`
 * Publish data `GbDataStream.topic('key').publish({v});`
 * Taken from the Rovotics Copilot Page
 * @param rosUrl - optional ROS url that's used. Default is master:9090
 */
export class GbDataStream {
  public connected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  private ros: any;
  private rosUrl: string = "ws://master:9090"; // ROS URl to be used

  /**
   * List of subscriber information that is later initialized
   * Information comes from the ROS Network
   */
  private topicInformation = [
    {
      key: "verticalDrive",
      name: "/rov/cmd_horizontal_vdrive",
      messageType: "vector_drive/thrusterPercents"
    }
  ];

  /**
   * Array of subscribers
   */
  private subscribers = Array<RosSubscriber>();

  constructor(rosUrl: string) {
    this.rosUrl = rosUrl;
    // @ts-ignore
    this.ros = new ROSLIB.Ros({
      url: this.rosUrl
    });

    this.connected.next(false);
    this.initializeRosConnection();
    this.initializeRov();
  }

  public initializeRosConnection(): boolean {
    this.ros.on("error", (e: any) => {
      console.warn("ROS Initialization Error");
    });
    this.ros.on("connection", () => {
      this.connected.next(true);
    });
    this.ros.on("close", () => {
      this.connected.next(false);
    });
    return true;
  }

  public initializeRov(): boolean {
    /**
     * Initializes all ROS connections
     */
    for (let i = 0; i < this.topicInformation.length; i++) {
      this.subscribers[i] = new RosSubscriber(
        this.topicInformation[i].key,
        this.topicInformation[i].name,
        this.topicInformation[i].messageType,
        this.ros
      );
    }
    return true;
  }

  public topic(key: string) {
    return this.subscribers.find(o => o.key === key);
  }
}

/**
 * Generic ROS subscriber
 * @param name: string- Topic name
 * @param messageType: string - i.e. 'vector_drive/thrusterPercents'
 * @param ROS - initialized ros object
 */
export class RosSubscriber {
  get data(): Observable<any> {
    return this._data.asObservable();
  }

  public key: string;
  private _data: Subject<any>;
  private lastPublishedValue: any;
  private topic: any; // ROS Topic Object

  constructor(
    public _key: string,
    private name: string,
    private messageType: string,
    private ros: any
  ) {
    this.key = _key;
    this._data = new Subject<any>();
    this.initialize();
  }

  public publish(data: any): boolean {
    // @ts-ignore
    const message = new this.ROSLIB.Message({
      data
    });
    this.lastPublishedValue = data;
    return this.topic.publish(message).then(
      (value: any) => {
        return true;
      },
      (reason: any) => {
        return false;
      }
    );
  }

  /**
   * Initialize the ROS connection using the information passed in
   */
  private initialize() {
    // @ts-ignore
    this.topic = new ROSLIB.Topic({
      ros: this.ros,
      name: this.name,
      messageType: this.messageType
    });
    console.log("t");

    this.topic.subscribe((message: any) => {
      // Check that you aren't subscribing to last published value, prevent echo
      if (message !== this.lastPublishedValue) {
        this._data.next(message);
      }
    });
  }
}
