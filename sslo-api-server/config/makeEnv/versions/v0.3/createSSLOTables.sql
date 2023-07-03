
SET FOREIGN_KEY_CHECKS=0;


# system info
DROP TABLE if  exists `system_info`;
CREATE TABLE if not exists `system_info` (
  `version` varchar(32) NOT NULL,
  `name` varchar(100),
  `desc` varchar(512),
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`version`)
);

insert into system_info(`version`, `name`, `desc`, `created`, `updated` ) select 'v0.1', 'sslo_db', 'sslo database', DATE('2022-09-01'), DATE('2022-09-01') ; 
insert into system_info(`version`, `name`, `desc`, `created`, `updated` ) select 'v0.2', 'sslo_db', 'modify updated', DATE('2022-10-28'), DATE('2022-10-28') ; 
insert into system_info(`version`, `name`, `desc`, `created`, `updated` ) select 'v0.3', 'sslo_db', 'modify project_type', DATE('2022-11-03'), DATE('2022-11-03') ; 


# user
DROP TABLE if  exists `user`;
CREATE TABLE if not exists `user` (
  `user_id` varchar(32) NOT NULL,
  `user_password` varchar(100),
  `user_display_name` varchar(45) NOT NULL,
  `user_email` varchar(321) NOT NULL UNIQUE,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
);


# comment
DROP TABLE if  exists `comment`;
CREATE TABLE `comment` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `comment_body` varchar(512) NOT NULL,
    
  `comment_creator_id` varchar(32),
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  `comment_updater_id` varchar(32),
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`comment_id`),
  CONSTRAINT `comment_comment_creator_id_FK` FOREIGN KEY (`comment_creator_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `comment_comment_updater_id_FK` FOREIGN KEY (`comment_updater_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
);


# project type
DROP TABLE if  exists `project_type`;
CREATE TABLE if not exists `project_type` (
  `project_type_id` int NOT NULL,
  `project_type_name` varchar(45) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_type_id`)
);


insert into `project_type`(`project_type_id`, `project_type_name`) select 1, '수집/정제';
insert into `project_type`(`project_type_id`, `project_type_name`) select 2, '전처리';
insert into `project_type`(`project_type_id`, `project_type_name`) select 3, '가공';

-- roles_globals definition
DROP TABLE if  exists `roles_globals`;
CREATE TABLE `roles_globals` (
  `user_id` varchar(32) NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`user_id`,`role_id`),
  KEY `roles_globals_user_id_FK` (`user_id`),
  KEY `roles_globals_role_id_FK` (`role_id`),
  KEY `role_id_idx` (`role_id`),
  CONSTRAINT `roles_globals_role_id_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_globals_user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;


-- sslo_test.roles_projects definition
DROP TABLE if  exists `roles_projects`;
CREATE TABLE `roles_projects` (
  `user_id` varchar(32) NOT NULL,
  `project_id` int NOT NULL,
  `role_id` int NOT NULL,
  PRIMARY KEY (`project_id`,`user_id`,`role_id`),
  KEY `roles_projects_user_id_FK` (`user_id`),
  KEY `role_id_idx` (`role_id`),
  CONSTRAINT `roles_projects _role_id_FK` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_projects_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `roles_projects_user_id_FK` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;

# roles
DROP TABLE if  exists `roles`;
 CREATE TABLE if not exists `roles` (
  `role_id` int NOT NULL ,
  `role_name` varchar(45) DEFAULT NULL,
  `role_desc` varchar(512) DEFAULT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`)
) ;


insert into roles(role_id, role_name) select 1, 'Administrator' ;
insert into roles(role_id, role_name) select 3, 'Member';
#insert into roles(role_id, role_name) select max(role_id)+1, 'Project Manager' from roles limit 1;


#project 
-- sslo_test.project definition
DROP TABLE if  exists `project`;
CREATE TABLE `project` (
  `project_id` int NOT NULL AUTO_INCREMENT,
  `project_name` varchar(32) NOT NULL,
  `project_desc` varchar(512) DEFAULT NULL,
  `project_status` int NOT NULL DEFAULT 1,
  `project_type_id` int NOT NULL,
  `project_manager_id` varchar(32),
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`project_id`),
  CONSTRAINT `project_project_type_id_FK` FOREIGN KEY (`project_type_id`) REFERENCES `project_type` (`project_type_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_project_manager_id_FK` FOREIGN KEY (`project_manager_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE

) ;


DROP TABLE if  exists `project_detail`;
CREATE TABLE `project_detail` (
  `project_id` int NOT NULL,
  `project_type_id` int NOT NULL,
  `item_name` varchar(32) NOT NULL,
  `item_val` varchar(255) ,
  `item_val_int` int,
  `item_val_datetime` datetime,
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`project_id`,`project_type_id`, `item_name`),
  CONSTRAINT `project_detail_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `project_detail_project_type_id_FK` FOREIGN KEY (`project_type_id`) REFERENCES `project_type` (`project_type_id`) ON DELETE CASCADE ON UPDATE CASCADE

) ;


# annotation

DROP TABLE if  exists `annotation_type`;
CREATE TABLE `annotation_type` (
  `annotation_type_id` int NOT NULL,
  `annotation_type_name` varchar(32) NOT NULL,
  `annotation_type_desc` varchar(512) NOT NULL,
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`annotation_type_id`)

) ;

insert into annotation_type(annotation_type_id, annotation_type_name, annotation_type_desc)
select 1, 'bbox', 'box annotation';
insert into annotation_type(annotation_type_id, annotation_type_name, annotation_type_desc)
select 2, 'polygon', 'polygon annotation';
insert into annotation_type(annotation_type_id, annotation_type_name, annotation_type_desc)
select 3, 'segment', 'segment annotation';


DROP TABLE if  exists `annotation_category`;
CREATE TABLE `annotation_category` (
  `annotation_category_id` int NOT NULL ,
  `project_id` int NOT NULL ,
  `annotation_category_name` varchar(128) NOT NULL,
  `annotation_category_parent_id` int NULL,
  `annotation_category_color` varchar(10) NOT NULL,
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`annotation_category_id`, `project_id`),
  CONSTRAINT `annotation_category_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;


DROP TABLE if  exists `annotation_category_coco`;
CREATE TABLE `annotation_category_coco` (
  `annotation_category_id` int NOT NULL ,
  `annotation_category_name` varchar(128) NOT NULL,
  `annotation_category_parent_id` int NULL,
  `annotation_category_color` varchar(10) NOT NULL DEFAULT '#4C6793',
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`annotation_category_id`)
) ;
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      0,'person';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      1,'bicycle';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      2,'car';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      3,'motorbike';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      4,'aeroplane';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      5,'bus';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      6,'train';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      7,'truck';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      8,'boat';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      9,'traffic light';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      10,'fire hydrant';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      11,'stop sign';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      12,'parking meter';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      13,'bench';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      14,'bird';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      15,'cat';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      16,'dog';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      17,'horse';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      18,'sheep';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      19,'cow';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      20,'elephant';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      21,'bear';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      22,'zebra';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      23,'giraffe';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      24,'backpack';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      25,'umbrella';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      26,'handbag';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      27,'tie';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      28,'suitcase';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      29,'frisbee';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      30,'skis';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      31,'snowboard';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      32,'sports ball';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      33,'kite';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      34,'baseball bat';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      35,'baseball glove';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      36,'skateboard';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      37,'surfboard';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      38,'tennis racket';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      39,'bottle';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      40,'wine glass';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      41,'cup';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      42,'fork';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      43,'knife';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      44,'spoon';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      45,'bowl';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      46,'banana';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      47,'apple';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      48,'sandwich';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      49,'orange';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      50,'broccoli';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      51,'carrot';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      52,'hot dog';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      53,'pizza';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      54,'donut';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      55,'cake';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      56,'chair';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      57,'sofa';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      58,'pottedplant';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      59,'bed';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      60,'diningtable';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      61,'toilet';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      62,'tvmonitor';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      63,'laptop';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      64,'mouse';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      65,'remote';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      66,'keyboard';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      67,'cell phone';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      68,'microwave';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      69,'oven';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      70,'toaster';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      71,'sink';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      72,'refrigerator';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      73,'book';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      74,'clock';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      75,'vase';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      76,'scissors';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      77,'teddy bear';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      78,'hair drier';
insert into annotation_category_coco(annotation_category_id, annotation_category_name) select      79,'toothbrush';




DROP TABLE if  exists `annotation_category_attribute`;
CREATE TABLE `annotation_category_attribute` (
  `annotation_category_attr_id` int NOT NULL,
  `annotation_category_id` int NOT NULL,
  `project_id` int NOT NULL ,
  `annotation_category_attr_name` varchar(64) NOT NULL,
  `annotation_category_attr_desc` varchar(256) NULL,
  `annotation_category_attr_type` int NOT NULL,
  `annotation_category_attr_val` varchar(256) NOT NULL,
  `annotation_category_attr_limit_min` int NULL,
  `annotation_category_attr_limit_max` int NULL,
 
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`annotation_category_attr_id`, `annotation_category_id`, `project_id`),
  CONSTRAINT `annotation_category_attribute_annotation_category_id_FK` FOREIGN KEY (`annotation_category_id`) REFERENCES `annotation_category` (`annotation_category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `annotation_category_attribute_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ;



# task
DROP TABLE if  exists `license`;
CREATE TABLE `license` (
  `license_id` int NOT NULL,
  `license_name` varchar(256) NOT NULL,
  `license_url` varchar(512),
  `license_desc` varchar(512),
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`license_id`)

) ;

# license
INSERT INTO license (license_id, license_name, license_url, license_desc) 
select 1, 'no license', 'http://', ''
;

INSERT INTO license (license_id, license_name, license_url, license_desc) 
select 2, 'sslo license', 'http://sslo.ai', 'tbell.co'
;

DROP TABLE if  exists `task_type`;
CREATE TABLE `task_type` (
  `task_type_id` int NOT NULL,
  `task_type_name` varchar(256) NOT NULL,
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`task_type_id`)

) ;

insert into task_type(task_type_id, task_type_name) select 1, 'image' ;


DROP TABLE if exists `task`;
CREATE TABLE `task` (
  `task_id` int NOT NULL,
  `project_id` int NOT NULL,
  
  `task_type_id` int NOT NULL,
  `task_name` varchar(256) NOT NULL,
  `task_category` varchar(32),
  `task_sub_category` varchar(32),
  `license_id` int,
  `task_worker_id` varchar(32),
  `task_validator_id` varchar(32),
  
  `task_status_step` int NOT NULL DEFAULT 1,
  `task_status_progress` int NOT NULL DEFAULT 1,
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`task_id`, `project_id`),
  CONSTRAINT `task_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `task_license_id_FK` FOREIGN KEY (`license_id`) REFERENCES `license` (`license_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_task_worker_id_FK` FOREIGN KEY (`task_worker_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_task_validator_id_FK` FOREIGN KEY (`task_validator_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_task_type_id_FK` FOREIGN KEY (`task_type_id`) REFERENCES `task_type` (`task_type_id`) ON DELETE CASCADE ON UPDATE CASCADE

);



DROP TABLE if  exists `task_detail`;
CREATE TABLE `task_detail` (
  `project_id` int NOT NULL,
  `task_id` int NOT NULL,
  `item_name` varchar(32) NOT NULL,
  `item_val` varchar(255) ,
  `item_val_int` int,
  `item_val_datetime` datetime,
  
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`project_id`,`task_id`, `item_name`),
  CONSTRAINT `task_detail_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `task_detail_task_id_FK` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE

) ;

DROP TABLE if  exists `ref_task_comment`;
CREATE TABLE `ref_task_comment` (
  `project_id` int NOT NULL,
  `task_id` int NOT NULL,
  `task_status_step` int NOT NULL,
  `task_status_progress` int NOT NULL,
  
  `comment_id` int NOT NULL,
  
  
  PRIMARY KEY (`project_id`, `task_id`, `task_status_step`, `task_status_progress`),
  CONSTRAINT `ref_task_comment_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ref_task_comment_task_id_FK` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ref_task_comment_comment_id_FK` FOREIGN KEY (`comment_id`) REFERENCES `comment` (`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE

);



# annotaion - task
DROP TABLE if  exists `annotation`;
CREATE TABLE `annotation` (
  `annotation_id` int NOT NULL,
  `project_id` int NOT NULL,
  
  `task_id` int NOT NULL,
  `annotation_type_id` int NOT NULL,
  `annotation_category_id` int NOT NULL,
  `annotation_category_attr_id` int,
  
  `annotation_category_attr_val_select` text,
  `annotation_category_attr_val_input` int,
  
  `annotation_data` text NOT NULL,
 
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`annotation_id`, `project_id`),
  CONSTRAINT `annotation_project_id_FK` FOREIGN KEY (`project_id`) REFERENCES `project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `annotation_task_id_FK` FOREIGN KEY (`task_id`) REFERENCES `task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `annotation_annotation_category_id_FK` FOREIGN KEY (`annotation_category_id`) REFERENCES `annotation_category` (`annotation_category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `annotation_annotation_category_attr_id_FK` FOREIGN KEY (`annotation_category_attr_id`) REFERENCES `annotation_category_attribute` (`annotation_category_attr_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `annotation_annotation_type_id_FK` FOREIGN KEY (`annotation_type_id`) REFERENCES `annotation_type` (`annotation_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
  
) ;


# dataset
DROP TABLE if  exists `dataset`;
CREATE TABLE `dataset` (
  `dataset_id` int NOT NULL AUTO_INCREMENT,
  `dataset_name` varchar(32) NOT NULL,
  `dataset_desc` varchar(512) DEFAULT NULL,
  `dataset_items_count` int NOT NULL DEFAULT 0,
  `dataset_items_size` bigint NOT NULL DEFAULT 0,
  `dataset_category` varchar(32),
  `dataset_sub_category` varchar(32),
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`dataset_id`),
  CONSTRAINT `dataset_name_UK` UNIQUE (dataset_name)

) ;

DROP TABLE if exists `rawdata`;
CREATE TABLE `rawdata` (
  `rawdata_id` bigint NOT NULL,
  `dataset_id` int NOT NULL,
  
  `rawdata_name` varchar(256) NOT NULL,
  `rawdata_fortmat` varchar(32) NOT NULL DEFAULT 'PNG',
  `rawdata_filename` varchar(512) NOT NULL,
  `rawdata_size` int,

  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`rawdata_id`, `dataset_id`),
  CONSTRAINT `rawdata_dataset_id_FK` FOREIGN KEY (`dataset_id`) REFERENCES `dataset` (`dataset_id`) ON DELETE CASCADE ON UPDATE CASCADE

);

