package com.jalo.football.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.jalo.football.entity.ClubEntity;
import com.jalo.football.model.Club;
import com.jalo.football.service.ClubService;

@Controller
@RequestMapping("/club")
public class ClubController {

	@Autowired
	private ClubService clubService;
	
	@GetMapping("/{id}")
	public @ResponseBody Club findOne(@PathVariable Long id) throws Exception {
		
		Club model = clubService.findById(id);
		
		if (model == null) {
			throw new Exception(String.format("FootballClub with ID %s not found.", id));
		}
		
		return model;
	}
	
	@PostMapping("/create")
	public String create(@ModelAttribute Club club) {

		ClubEntity entity = clubService.convert(club);
		
		return "redirect:/club/" + entity.getId();
	}
	
}
