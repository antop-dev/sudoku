<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<%@ taglib prefix="json" uri="http://www.atg.com/taglibs/json"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<json:object>
	<c:import url="../success.jsp" charEncoding="UTF-8" />
	<json:property name="total" value="${total}" />
	<json:array name="data" var="sudoku" items="${grids}">
		<json:object>
			<json:property name="seq" value="${sudoku.seq}" />
			<json:property name="created" value="${sudoku.created}" />
			<json:property name="cost">
				<fmt:formatDate value="${sudoku.cost}" pattern="H:mm:ss" />
			</json:property>
		</json:object>
	</json:array>
</json:object>