module.exports = {
  default: {
    host: "localhost",
    port: 3306,
    database: "example",
    user: "dasom",
    password: "dasom",
    dateStrings: "date"
  },
  // test: {
  //   host: "localhost",
  //   port: 3306,
  //   database: "example",
  //   username: "dasom",
  //   password: "dasom",
  // },
};

// ###### CREATE CODE
// CREATE TABLE `students` (
// 	`id` INT(10) NOT NULL AUTO_INCREMENT COMMENT '고유번호',
// 	`student_name` VARCHAR(45) NOT NULL COMMENT '수강생 이름' COLLATE 'utf8mb4_general_ci',
// 	`student_email` VARCHAR(45) NULL DEFAULT NULL COMMENT '수강생 이메일' COLLATE 'utf8mb4_general_ci',
// 	`created` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '생성일',
// 	`modified` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '수정일',
// 	`student_status` TINYINT(1) NOT NULL DEFAULT '1' COMMENT '수강생 상태\n1 정상',
// 	PRIMARY KEY (`id`) USING BTREE,
// 	UNIQUE INDEX `student_email_UNIQUE` (`student_email`) USING BTREE
// )
// COMMENT='수강생'
// COLLATE='utf8mb4_general_ci'
// ENGINE=InnoDB
// ;