package com.mobylab.springbackend.controller;

import com.mobylab.springbackend.service.RoleService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;



import java.util.List;
import java.util.HashMap;
import java.util.Map;
import com.mobylab.springbackend.service.UserService;
import com.mobylab.springbackend.service.PostService;



@RestController
@RequestMapping("/api/v1/role")
public class RoleController implements SecuredRestController{

    private static final Logger logger = LoggerFactory.getLogger(RoleController.class);

    @Autowired
    private RoleService roleService;

    @Autowired
    private UserService userService;

    @Autowired
    private PostService postService;

    @RequestMapping(path = "/add", method = RequestMethod.POST)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addRoles(@RequestBody List<String> roleList) {
        logger.info("Request to add roles {}", roleList);
        List<String> addedRoles = roleService.addRoles(roleList);
        logger.info("Successfully added roles {}", addedRoles);
        return new ResponseEntity<>(addedRoles, HttpStatus.CREATED);
    }


    @RequestMapping(path = "/dashboard", method = RequestMethod.GET)
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getDashboardData() {
        logger.info("Request to access dashboard data");

        List<?> allUsers = userService.findAll();
        List<?> allPosts = postService.findAll();

        logger.info("Fetched {} users and {} posts", allUsers.size(), allPosts.size());

        Map<String, Object> response = new HashMap<>();
        response.put("users", allUsers);
        response.put("posts", allPosts);

        return ResponseEntity.ok(response);
    }
}
