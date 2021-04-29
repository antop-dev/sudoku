package kr.nerv.antop.controller;

import java.util.List;

import kr.nerv.antop.model.ScoreModel;
import kr.nerv.antop.service.ScoreService;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class ScoreServlet {
	// log4j
	protected Logger logger = Logger.getLogger(getClass());

	@Autowired
	private ScoreService service;

	@RequestMapping(value = "score/list.do")
	public ModelAndView rank(@RequestParam(value = "seq", required = true) int seq) {
		ModelAndView mav = new ModelAndView("score/list");
		// success
		boolean success = true;

		try {
			List<ScoreModel> scoreList = service.list(seq);
			mav.addObject("scores", scoreList);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			success = false;
			mav.addObject("msg", e.getMessage());
		}

		mav.addObject("success", success);
		return mav;
	}
		
	@RequestMapping(value = "/score/regist.do")
	public ModelAndView regist(@RequestParam int seq, @RequestParam String cost, @RequestParam String name) {
		ModelAndView mav = new ModelAndView("score/score");
		// success
		boolean success = true;

		try {
			// 기록 등록 후 현재 자신이 몇위로 등록되어 있는지 가져온다.
			ScoreModel score = service.regist(seq, name, cost);
			mav.addObject("score", score);
		} catch (Exception e) {
			logger.error(e.getMessage(), e);

			success = false;
			// error message
			mav.addObject("msg", e.getMessage());
		}

		mav.addObject("success", success);
		return mav;
	}
}